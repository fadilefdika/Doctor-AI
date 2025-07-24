from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_auth import register_user, login_user

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(auth: AuthRequest):
    result = register_user(auth.email, auth.password)
    
    if result and getattr(result, "error", None):
        raise HTTPException(status_code=400, detail=result.error.message)

    return {
        "message": "User registered successfully",
        "user": result.user.email if result.user else None,
    }


@router.post("/login")
def login(auth: AuthRequest):
    result = login_user(auth.email, auth.password)

    # Aman: cek kalau `result` ada, dan punya atribut `error`
    if result and getattr(result, "error", None):
        raise HTTPException(status_code=400, detail=result.error.message)

    return {
        "message": "Login successful",
        "user": result.user.email if result.user else None,
    }

