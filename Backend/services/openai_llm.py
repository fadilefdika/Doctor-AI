from openai import OpenAI

client = OpenAI(api_key="OPENAI_API_KEY")  # bisa juga pakai env var: api_key=os.getenv("OPENAI_API_KEY")

def ask_gpt(*messages: dict) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=list(messages),
        temperature=0.7,
        max_tokens=500
    )
    return response.choices[0].message.content
