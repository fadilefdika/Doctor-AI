import os
from datetime import datetime
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_recent_symptoms(user_id: str, session_id: str) -> list[dict]:
    response = supabase \
        .from_("chat_messages") \
        .select("message, created_at") \
        .eq("user_id", user_id) \
        .eq("role", "user") \
        .eq("session_id", session_id) \
        .order("created_at", desc=True) \
        .execute()

    return response.data or []



def save_symptom_summary(user_id: str, summary: str) -> None:
    supabase \
        .from_("symptom_summaries") \
        .insert([{
            "user_id": user_id,
            "summary": summary,
            "created_at": datetime.utcnow().isoformat()
        }]) \
        .execute()


def save_symptom_message(user_id: str, message: str, session_id: str, role: str = "user"):
    response = supabase \
        .from_("chat_messages") \
        .insert({
            "user_id": user_id,
            "message": message,
            "role": role,
            "session_id": session_id
        }) \
        .execute()
    return response

def build_messages_with_history(user_id: str, session_id: str, new_user_message: str) -> list[dict]:
    # Ambil histori chat dari session ini
    response = supabase \
        .from_("chat_messages") \
        .select("role, message") \
        .eq("user_id", user_id) \
        .eq("session_id", session_id) \
        .order("created_at", asc=True) \
        .execute()

    history = response.data or []
    messages = [{"role": msg["role"], "content": msg["message"]} for msg in history]

    # Tambahkan input user terbaru (jika belum dimasukkan)
    messages.append({"role": "user", "content": new_user_message})

    return messages



def start_new_session(user_id: str, session_id: str):
    supabase \
        .from_("chat_sessions") \
        .insert({
            "id": session_id,  # jika ID UUID digunakan sebagai primary key
            "user_id": user_id,
            "started_at": datetime.utcnow().isoformat()
        }) \
        .execute()
