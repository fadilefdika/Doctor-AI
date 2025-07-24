# routers/doctor.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/doctors")
def get_doctors():
    return {"message": "Daftar dokter"}
