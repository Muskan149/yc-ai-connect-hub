from create_embeddings import get_embedding
from pinecone_setup import get_index

def search_profiles(query, top_k=10, threshold=0.6):
    query_vec = get_embedding(query)
    index = get_index()
    results = index.query(vector=query_vec, top_k=top_k, include_metadata=True)

    matches = [
        match.metadata for match in results.matches if match.score >= threshold
    ]
    return matches
