from openai import OpenAI

client = OpenAI(api_key="OPENAI_API_KEY")  # Ganti dengan API key Anda atau gunakan env var
print("✅ OpenAI client berhasil dibuat", client)
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