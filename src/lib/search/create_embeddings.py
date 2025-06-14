from pinecone_setup import get_index
import openai

def get_embedding(text: str):
    response = openai.embeddings.create( 
        input=[text],
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def format_profile(profile):
    return f"""
    Name: {profile['name']}
    School: {profile['school']}
    Location: {profile['location']}
    Experience: {profile['experience']}
    Interests: {', '.join(profile['interests'])}
    Looking For: {profile['looking_for']}
    Can Help With: {profile['support']}
    Mukku Approved: {profile['mukku_approved']}
    """

def index_profile(profile):
    text = format_profile(profile)
    embedding = get_embedding(text)
    index = get_index()
    index.upsert([(profile['id'], embedding, profile)])