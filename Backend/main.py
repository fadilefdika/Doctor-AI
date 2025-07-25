from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routers import auth, chat, doctor

app = FastAPI()

# Tambahkan CORS middleware di sini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ubah ke domain frontend jika perlu keamanan tambahan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(doctor.router)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"welcome to doctor AI"}
