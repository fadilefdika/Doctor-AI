from fastapi import FastAPI
from pydantic import BaseModel
from routers import auth, chat, doctor

app = FastAPI()

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(doctor.router)

class ChatRequest(BaseModel):
    message: str
    
@app.get("/")
def read_root():
    return {"welcome to doctor AI"}