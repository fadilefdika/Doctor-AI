from supabase import create_client, Client
import os
from dotenv import load_dotenv
from gotrue.errors import AuthApiError

# Load .env file
load_dotenv()

# Ambil environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Debug: Cek apakah terbaca
print("SUPABASE_URL:", SUPABASE_URL)
print("SUPABASE_KEY:", SUPABASE_KEY[:8] + "..." if SUPABASE_KEY else None)

# Buat client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fungsi register
def register_user(email: str, password: str, nama: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        # Jika ingin menyimpan `nama` ke user metadata
        if response.user:
            supabase.auth.update_user(
                {"data": {"nama": nama}},
                session=response.session.access_token if response.session else None
            )

        return {
            "user": response.user,
            "session": response.session,
        }

    except AuthApiError as e:
        error_message = str(e).lower()

        if "user already registered" in error_message:
            return {"error": "Email sudah digunakan"}
        elif "invalid email" in error_message:
            return {"error": "Format email tidak valid"}
        elif "password should be at least" in error_message:
            return {"error": "Password terlalu pendek"}
        else:
            return {"error": f"Terjadi kesalahan saat registrasi: {e}"}

# Fungsi login
def login_user(email: str, password: str) -> dict:
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        data = response.model_dump()

        return {
            "access_token": data["session"]["access_token"],
            "user": data["user"]
        }

    except AuthApiError as e:
        error_message = str(e).lower()

        if "invalid login credentials" in error_message:
            return {"error": "Email atau password salah"}
        elif "user not found" in error_message:
            return {"error": "Email tidak ditemukan"}
        elif "email not confirmed" in error_message:
            return {"error": "Email belum dikonfirmasi"}
        else:
            return {"error": f"Gagal login: {error_message}"}


def get_user_profile(token: str):
    response = supabase.auth.get_user(token)
    return response.user if not response.get("error") else None
