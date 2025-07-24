import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_gpt(*messages: dict) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=list(messages),
        temperature=0.7,
        max_tokens=500
    )
    return response["choices"][0]["message"]["content"]
