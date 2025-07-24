from supabase import create_client, Client
import os
from dotenv import load_dotenv

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
    response = supabase.auth.sign_up({
        "email": email,
        "password": password,
        "nama" : nama
    })
    return response

# Fungsi login
def login_user(email: str, password: str):
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    if not response.session:
        raise Exception("Login failed or session not returned.")

    access_token = response.session.access_token
    user = response.user

    return {
        "user": user,
        "access_token": access_token
    }


def get_user_profile(token: str):
    response = supabase.auth.get_user(token)
    return response.user if not response.get("error") else None
