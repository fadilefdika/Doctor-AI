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


def save_symptom_message(user_id: str, message: str, session_id: str):
    response = supabase \
        .from_("chat_messages") \
        .insert({
            "user_id": user_id,
            "message": message,
            "role": "user",
            "session_id": session_id
        }) \
        .execute()
    return response


def start_new_session(user_id: str, session_id: str):
    supabase.from_("chat_sessions").insert({
        "user_id": user_id,
        "session_id": session_id
    }).execute()
