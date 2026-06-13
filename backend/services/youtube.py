import httpx
import os
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

# These are interest topics
TOPICS = {
    "study": [
        "React hooks explained",
        "FastAPI tutorial",
        "Python async explained",
        "machine learning basics",
        "system design basics",
        "SQL joins explained",
        "git workflow tutorial",
    ],
    "browse": [
        "GPU benchmark 2025",
        "mechanical keyboard review",
        "PC build guide budget",
        "indie game review",
        "tech news this week",
    ]
}

async def fetch_youtube_suggestion(category: str) -> dict | None:
    """
    Picks a random topic for the given category,
    searches YouTube, returns one video as a suggestion dict.
    Returns None if the API call fails.
    """
    import random
    
    # Only for study and browsing
    if category not in TOPICS:
        return None
    
    topic = random.choice(TOPICS[category])
    
    params = {
        "part": "snippet",
        "q": topic,
        "type": "video",
        "maxResults": 5,
        "videoDuration": "medium", # 4-20 minutes 
        "relevanceLanguage": "en",
        "key": YOUTUBE_API_KEY
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(YOUTUBE_SEARCH_URL, params=params, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            
        items = data.get("items", [])
        if not items:
            return None
        
        # Pick the first result
        video = items[0]
        video_id = video["id"]["videoId"]
        title = video["snippet"]["title"]
        channel = video["snippet"]["channelTitle"]
        
        return {
            "title": f"{title} - {channel}",
            "category": category,
            "source": "youtube",
            "url": f"https://youtube.com/watch?v={video_id}",
            "duration_minutes": 10, # estimate - YouTube API needs extra call for exact duration
        }
        
    except Exception as e:
        print(f"YouTube API error: {e}")
        return None