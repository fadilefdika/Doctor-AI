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
def register_user(email: str, password: str):
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })
    return response

# Fungsi login
def login_user(email: str, password: str):
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })
    return response


if __name__ == "__main__":
    test_email = "testuser@example.com"
    test_password = "TestPassword123"

    print("🔧 Testing Register...")
    register_response = register_user(test_email, test_password)
    print(register_response)

    print("\n🔐 Testing Login...")
    login_response = login_user(test_email, test_password)
    print(login_response)