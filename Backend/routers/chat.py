from pydantic import BaseModel

from fastapi import APIRouter, Request, Depends, HTTPException
from middleware.auth_guard import verify_token
from services.symptom_service import fetch_recent_symptoms, save_symptom_summary
from services.openai_llm import ask_gpt


class SymptomInput(BaseModel):
    message: str

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/summary")
async def chat_summary(request: Request, user: dict = Depends(verify_token)):
    user_id = user["sub"]
    print("USER:", user)
    # Ambil 3 gejala terakhir user
    recent_symptoms = fetch_recent_symptoms(user_id)
    if len(recent_symptoms) < 3:
        raise HTTPException(
            status_code=400,
            detail="Minimal 3 gejala harus dikirimkan sebelum membuat ringkasan."
        )

    # Siapkan prompt untuk LLM
    system_message = {"role": "system", "content": "Kamu adalah Doctor AI yang sangat cerdas di bidang medis."}
    user_messages = [{"role": "user", "content": msg["message"]} for msg in reversed(recent_symptoms)]
    messages = [system_message] + user_messages

    # Kirim ke OpenAI LLM
    try:
        summary = ask_gpt(*messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghasilkan ringkasan: {str(e)}")

    # Simpan ke database
    save_symptom_summary(user_id, summary)

    return {
        "message": "Ringkasan berhasil dibuat.",
        "summary": summary
    }



@router.post("/send")
async def send_symptom(input: SymptomInput, user: dict = Depends(verify_token)):
    user_id = user["sub"]

    # Simpan ke Supabase
    from services.symptom_service import save_symptom_message
    save_symptom_message(user_id, input.message)

    return {"message": "Gejala berhasil disimpan."}


