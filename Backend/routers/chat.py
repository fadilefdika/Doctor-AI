import uuid
import os
from pydantic import BaseModel
from fastapi import APIRouter, Request, Depends, HTTPException
from middleware.auth_guard import verify_token
from services.symptom_service import (
    fetch_recent_symptoms,
    save_symptom_summary,
    start_new_session,
    save_symptom_message,
    build_messages_with_history,
    parse_flashcards
)
from services.openai_llm import ask_gpt
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


router = APIRouter(prefix="/chat", tags=["chat"])

class SummaryInput(BaseModel):
    session_id: str

class SymptomInput(BaseModel):
    message: str
    session_id: str

@router.post("/start-session")
async def start_session(user: dict = Depends(verify_token)):
    user_id = user["sub"]
    session_id = str(uuid.uuid4())
    
    # Simpan session ke tabel chat_sessions
    start_new_session(user_id, session_id)

    return {"message": "Sesi baru dimulai", "session_id": session_id}

@router.post("/send")
async def send_symptom(input: SymptomInput, user: dict = Depends(verify_token)):
    user_id = user["sub"]

    # Simpan pesan user
    try:
        save_symptom_message(user_id, input.message, input.session_id, role="user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan pesan user: {str(e)}")

    # Bangun konteks percakapan
    try:
        messages = build_messages_with_history(user_id, input.session_id, input.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membangun konteks: {str(e)}")

    # Kirim ke GPT
    try:
        gpt_response = ask_gpt(*messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error dari GPT: {str(e)}")

    # Simpan respon GPT
    try:
        save_symptom_message(user_id, gpt_response, input.session_id, role="assistant")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan respon GPT: {str(e)}")

    return {"response": gpt_response}




@router.post("/summary")
async def chat_summary(input: SummaryInput, request: Request, user: dict = Depends(verify_token)):
    user_id = user["sub"]
    session_id = input.session_id

    recent_symptoms = fetch_recent_symptoms(user_id, session_id)
    if len(recent_symptoms) < 3:
        raise HTTPException(status_code=400, detail="Minimal 3 gejala harus dikirimkan sebelum membuat ringkasan.")

    system_message = {"role": "system", "content": "Kamu adalah Doctor AI yang sangat cerdas di bidang medis."}
    user_messages = [{"role": "user", "content": msg["message"]} for msg in reversed(recent_symptoms)]
    messages = [system_message] + user_messages

    try:
        summary = ask_gpt(*messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghasilkan ringkasan: {str(e)}")

    save_symptom_summary(user_id, summary)

    return {"message": "Ringkasan berhasil dibuat.", "summary": summary}


@router.get("/flashcards")
async def get_multiple_flashcards(user: dict = Depends(verify_token)):
    user_id = user["sub"]

    # Ambil 4 sesi terakhir milik user
    session_response = supabase \
        .from_("chat_sessions") \
        .select("id, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(4) \
        .execute()

    sessions = session_response.data or []

    if not sessions:
        return {"flashcards": []}

    flashcard_results = []

    for session in sessions:
        session_id = session["id"]

        # Ambil pesan user dari sesi tersebut
        msg_response = supabase \
            .from_("chat_messages") \
            .select("message") \
            .eq("session_id", session_id) \
            .eq("user_id", user_id) \
            .eq("role", "user") \
            .order("created_at") \
            .execute()

        messages = [m["message"] for m in msg_response.data or []]

        if not messages:
            continue  # skip session yang tidak ada pesannya

        combined_prompt = " ".join(messages)

        gpt_prompt = f"""
        Berdasarkan percakapan berikut: "{combined_prompt}", buatkan 3 flashcard edukasi medis untuk pengguna. 
        Format masing-masing flashcard:
        - Judul: ...
        - Isi: ...
        - Tipe: (Edukasi Gejala / Edukasi Penyakit / Tips Kesehatan)

        Jangan beri saran medis pasti, cukup edukatif.
        """

        try:
            result = ask_gpt({"role": "system", "content": gpt_prompt})
            parsed_cards = parse_flashcards(result)
            flashcard_results.extend(parsed_cards)
        except Exception as e:
            continue  # skip jika ada error pada satu sesi

    if not flashcard_results:
        raise HTTPException(status_code=404, detail="Tidak ada flashcard yang bisa dihasilkan.")

    return {"flashcards": flashcard_results}
