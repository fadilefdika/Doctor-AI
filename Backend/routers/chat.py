import uuid
from pydantic import BaseModel
from fastapi import APIRouter, Request, Depends, HTTPException
from middleware.auth_guard import verify_token
from services.symptom_service import (
    fetch_recent_symptoms,
    save_symptom_summary,
    start_new_session,
    save_symptom_message,
    build_messages_with_history
)
from services.openai_llm import ask_gpt

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

    # 1. Simpan pesan user
    save_symptom_message(user_id, input.message, input.session_id, role="user")

    # 2. Persiapkan konteks percakapan dari sesi
    messages = build_messages_with_history(user_id, input.session_id, input.message)

    # 3. Kirim ke GPT
    try:
        gpt_response = ask_gpt(*messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error from GPT: {str(e)}")

    # 4. Simpan respon GPT
    save_symptom_message(user_id, gpt_response, input.session_id, role="assistant")

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
