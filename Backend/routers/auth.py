from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from services.supabase_auth import register_user, login_user, get_user_profile

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthRequest(BaseModel):
    email: str
    password: str
    nama: str

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(auth: AuthRequest):
    result = register_user(auth.email, auth.password, auth.nama)

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "message": "User registered successfully",
        "user": result["user"].email if result["user"] else None,
    }


@router.post("/login")
def login(auth: LoginRequest):
    result = login_user(auth.email, auth.password)

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "message": "Login successful",
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": result["user"]["email"]
    }



@router.get("/profile")
def profile(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user = get_user_profile(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "email": user.email,
        "display_name": user.user_metadata.get("display_name")
    }