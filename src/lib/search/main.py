from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from search import search_profiles

app = FastAPI()

# CORS to allow frontend requests (change "*" to your frontend URL in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search")
async def search(request: Request):
    data = await request.json()

    query = data["query"]
    top_k = data.get("top_k", 10)
    threshold = data.get("threshold", 0.8)  

    results = search_profiles(query, top_k, threshold)
    
    return {"results": results}
