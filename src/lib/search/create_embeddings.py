import os
from pinecone_setup import get_index
from openai import OpenAI
from generate_summary import generate_profile_summary
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create embedding for a text
def create_embedding(text: str):
    try:
        response = client.embeddings.create( 
            input=[text],
            model="text-embedding-3-small"
        )
    except Exception as e:
        print("Error creating embedding: ", e)
        return None
    return response.data[0].embedding

# Add a profile's summary to the index
def index_profile(profile):
    print("Entered index_profile for profile: ", profile)
    summary_text = generate_profile_summary(profile)
    print("Summary text: ", summary_text)
    embedding = create_embedding(summary_text)
    index = get_index()
    print("Index: ", index)
    index.upsert([(profile['id'], embedding, profile)])
    print("Profile indexed")

# Given a query, return the top 5 profiles's IDs
def fetch_top_k_profiles(query: str, k: int = 5):
    print("Entered fetch_top_k_profiles function")
    print("The query is: ", query)
    print("The k is: ", k)
    index = get_index()
    query_embedding = create_embedding(query)
    results = index.query(vector=query_embedding, top_k=k, include_metadata=True)
    print("The results are: ", results)

    # Filter by score threshold
    threshold = 0.25
    filtered_results = [
        match for match in results['matches']
        if match['score'] >= threshold
    ]
    
    print("The filtered results are: ", filtered_results)

    return [match['id'] for match in filtered_results]

# def format_profile(profile):
#     return f"""
#     Name: {profile['name']}
#     School: {profile['school']}
#     Location: {profile['location']}
#     Experience: {profile['experience']}
#     Interests: {', '.join(profile['interests'])}
#     Looking For: {profile['looking_for']}
#     Can Help With: {profile['support']}
#     Mukku Approved: {profile['mukku_approved']}
#     """


# # make a call to the index_profile function for the following profiles:
# profiles = [
#     {
#         "id": "6632cfb9-8d39-4e3e-80ad-65b41a183012",
#         "created_at": "2025-06-14 22:41:01.994454+00",
#         "email": "elizabethjqiu@gmail.com",
#         "name": "Elizabeth Qiu",
#         "school": "CS @ Maryland",
#         "location": "San Francisco, CA",
#         "acceptance_email": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/screenshots//buzzbazaar_logo.png",
#         "image": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749940860516-5a6iw2xerda.jpg",
#         "experience": "entrepreneurship, startups, content creation, policy, engineering, research",
#         "interests": ["machine learning", "film", "art", "ai research"],
#         "looking_for": "meeting new and old friends!",
#         "support": "same as above",
#         "linkedin": "https://linkedin.com/in/~qiu",
#         "portfolio": "",
#         "twitter": "https://twitter.com/elizqiu",
#         "instagram": "",
#         "discord": "",
#         "mukku_approved": True
#     },
#     {
#         "id": "6b53ffac-6cf4-44f5-a78d-bc8522e08a01",
#         "created_at": "2025-06-14 13:08:12.56354+00",
#         "email": "muskanmahajan2004@gmail.com",
#         "name": "Muskan Mahajan",
#         "school": "CS @ Georgia Tech",
#         "location": "Atlanta, GA, USA",
#         "acceptance_email": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749906438910-fh2crgncvzl.png",
#         "image": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749906430846-whuvux2gr2.jpg",
#         "experience": "Tech Intern @ Catalyst by Wellstar. Founded and developed Buzz Bazaar - Georgia Tech's first reselling marketplace. VP External at Women @ College of Computing GT.",
#         "interests": ["ML", "Coffee", "Healthcare x Tech", "Working out", "Agents", "Hackathons"],
#         "looking_for": "People to co-create next big project and make friends from all over the country! Also summer'26 internship.",
#         "support": "Building full stack projects with AI and community building!",
#         "linkedin": "https://www.linkedin.com/in/muskanmahajan2004/",
#         "portfolio": "https://github.com/muskan149",
#         "twitter": "",
#         "instagram": "https://www.instagram.com/mukku_mjn/",
#         "discord": "",
#         "mukku_approved": True
#     },
#     {
#         "id": "4991633e-3112-4a98-bf03-d60a345ce58b",
#         "created_at": "2025-06-14 16:06:34.611119+00",
#         "email": "mahajanmehak04@gmail.com",
#         "name": "Mehak Mahajan",
#         "school": "Econ @ Kings College London",
#         "location": "London, UK",
#         "acceptance_email": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749917136366-g42tinejhon.jpg",
#         "image": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/WhatsApp%20Image%202025-06-14%20at%2012.23.38.jpeg",
#         "experience": "Incoming Analyst @ Deutsche Bank",
#         "interests": ["Finance", "Work out", "Climate Change and ESGs"],
#         "looking_for": "Looking to meet more tech people",
#         "support": "Anything finance LOL",
#         "linkedin": "https://www.linkedin.com/in/mehak24/",
#         "portfolio": "",
#         "twitter": "",
#         "instagram": "",
#         "discord": "",
#         "mukku_approved": True
#     },
#     {
#         "id": "a5cbd782-0086-4940-adba-fe371438f26c",
#         "created_at": "2025-06-14 20:35:14.856334+00",
#         "email": "Krishnasljrs@gmail.com",
#         "name": "Pranavkrishna Suresh",
#         "school": "Georgia Tech CS",
#         "location": "Atlanta, Georgia",
#         "acceptance_email": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749933303314-igqhni3immo.png",
#         "image": "https://zrqneqpcnphxsugbprwj.supabase.co/storage/v1/object/public/profiles/images/1749933265950-h2nv3sxu4t7.jpeg",
#         "experience": "Blaze market ycs25 founder",
#         "interests": [],
#         "looking_for": "Marketing people + supply chain specialists",
#         "support": "Distribution for fmcg worldwide - if u have a consumer brand ur trying to scale lmk",
#         "linkedin": "https://www.linkedin.com/pranavkrishnasuresh",
#         "portfolio": "https://pksuresh.vercel.app/",
#         "twitter": "",
#         "instagram": "",
#         "discord": "",
#         "mukku_approved": True
#     }
# ]

# def main():
#     print("Indexing profiles...")
#     for profile in profiles:
#         print("Indexing profile: ", profile)
#         index_profile(profile)

# main()