from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from create_embeddings import fetch_top_k_profiles, index_profile
from pydantic import BaseModel
from typing import Dict, Any
import os

class ProfileResponse(BaseModel):
    message: str
    success: bool

app = FastAPI()

# CORS to allow frontend requests (change "*" to your frontend URL in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", 
                   "https://yc-sus-roster.vercel.app", 
                   "https://yc-sus-roster.vercel.app/*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Search API is running"}

@app.post("/fetch_top_k_profiles")
async def perform_fetch_top_k_profiles(request: Request):
    print("Starting perform_fetch_top_k_profiles function")
    data = await request.json()
    query = data["query"]
    print("The query is: ", query)
    results = fetch_top_k_profiles(query, 5)
    print("The results are: ", results)
    return {"results": results}

@app.post("/index_profile", response_model=ProfileResponse)
async def perform_index_profile(request: Request):
    print("Starting perform_index_profile function")
    data = await request.json()
    print("Data received: ", data)
    profile = data["profile"]
    print("Profile received: ", profile)
    try:
        print("Indexing profile....")
        index_profile(profile)
        return {"message": "Profile indexed", "success": True}
    except Exception as e:
        print(f"Error indexing profile: {str(e)}")
        return {"message": f"Error indexing profile: {str(e)}", "success": False}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
