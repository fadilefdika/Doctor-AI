from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    return {"response": f"Kamu mengatakan: {request.message}"}


@app.get("/")
def read_root():
    return {"welcome to doctor AI"}