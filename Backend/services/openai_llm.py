from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # ✅ Ini akan berhasil setelah .env diload

def ask_gpt(*messages: dict) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=list(messages),
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error from GPT: {str(e)}")
