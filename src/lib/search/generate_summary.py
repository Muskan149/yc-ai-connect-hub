import os
from typing import Dict, List, Optional
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def format_profile(profile: Dict):
    return f"""
    Name: {profile['name']}
    School: {profile['school']}
    Location: {profile['location']}
    Experience: {profile['experience']}

    Interests: {", ".join(profile['interests']) if profile['interests'] else ""}
    Looking For: {profile['looking_for']}
    {f"- Support Offered: {profile['support']}" if profile['support'] else ""}
    """

def generate_profile_summary(
    profile: Dict
):
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Construct the prompt
    prompt = f"""
Below is a profile of an attendee. Write a friendly, concise 75–100 word summary of them that could help someone get a sense of who they are, their interests, what they can help with, what they're looking for. Be structured and don't miss key details.
{format_profile(profile)}
Summary:
"""
    try:
        # Make API call to GPT-3.5
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates friendly, concise profile summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        # Extract and return the generated summary
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return ""

# Example usage
if __name__ == "__main__":
    # Example profile data
    profile_data = {
        "name": "John Doe",
        "school": "Stanford University",
        "location": "San Francisco, CA",
        "experience": "Software Engineer at Google (2 years)",
        "interests": ["AI", "Machine Learning", "Web Development"],
        "looking_for": "Co-founders for an AI startup",
        "support": "Technical mentorship and product strategy",
        "linkedin": "https://linkedin.com/in/johndoe",
        "portfolio": "https://johndoe.com"
    }
    
    summary = generate_profile_summary(**profile_data)
    print(summary)
