from fastapi import FastAPI
from pydantic import BaseModel
from utils.LLM_utils import ask_llm

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    reply = ask_llm(request.message)
    return {"response": reply}


@app.get("/")
def read_root():
    return {"welcome to doctor AI"}