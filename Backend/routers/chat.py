from fastapi import APIRouter, Request, Depends
from middlewares.auth_guard import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/summary")
async def chat_summary(request: Request, user = Depends(verify_token)):
    # Ambil input dari frontend (gejala)
    data = await request.json()
    # Panggil LLM kamu (misal: OpenAI / Groq / Ollama)
    result = "Hasil analisis gejala..."
    return {"summary": result}
