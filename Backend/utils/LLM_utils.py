import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_llm(message: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # atau "gpt-4" jika kamu punya akses
        messages=[
            {"role": "system", "content": "Anda adalah asisten medis yang membantu menganalisis gejala."},
            {"role": "user", "content": f"Saya mengalami gejala: {message}"}
        ],
        temperature=0.7,
        max_tokens=300
    )
    return response['choices'][0]['message']['content']
