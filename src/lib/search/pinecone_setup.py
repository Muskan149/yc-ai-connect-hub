from pinecone import Pinecone, ServerlessSpec
import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Set keys
openai.api_key = os.getenv("OPENAI_API_KEY") 
pinecone_api_key = os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=pinecone_api_key)


PINECONE_INDEX_NAME = "yc-ai-profiles"
EMBEDDING_DIMENSION = 1536

if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )   
else:
    print(f"Index {PINECONE_INDEX_NAME} already exists") 

# Get index
def get_index():
    index = pc.Index(PINECONE_INDEX_NAME)
    return index
