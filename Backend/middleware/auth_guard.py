from fastapi import Request, HTTPException
import os
import httpx

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = auth_header.split(" ")[1]

    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_KEY
            }
        )

        if res.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Supabase token")

        user_data = res.json()

        # Coba ambil sub (user id) dari response
        user_id = user_data.get("id") or user_data.get("sub")  # biasanya "id" itu UUID user
        if not user_id:
            raise HTTPException(status_code=500, detail="User ID (sub) not found in Supabase response")

        # Return dict mirip payload
        return {
            "sub": user_id,
            "email": user_data.get("email"),
            "user_metadata": user_data.get("user_metadata", {})
        }
