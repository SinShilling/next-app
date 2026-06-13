from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from pydantic import BaseModel
from pydantic import BaseModel as PydanticBase
from services.youtube import fetch_youtube_suggestion
from datetime import datetime, timezone
import models
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

class ItemCreate(BaseModel):
    title : str
    category : str
    duration_minutes : int
    url : str = None

class FeedbackRequest(BaseModel):
    item_id : int
    action : str        # "did_it" or "skip"
    mood : str = None
    available_time : int = None

@app.get("/")
def root():
    return {"message": "NEXT backend is running"}

@app.get("/suggest")
async def suggest(                          # ← async now
    mood: str = "bored",
    time: int = 30,
    db: Session = Depends(get_db)
):
    MOOD_WEIGHTS = {
        "focused":  {"study": 3.0,  "stimulate": 1.0, "browse": 0.5, "game": 0.2},
        "bored":    {"study": 1.0,  "stimulate": 2.0, "browse": 2.0, "game": 2.0},
        "lazy":     {"browse": 3.0, "stimulate": 2.0, "game": 1.5,  "study": 0.3},
        "creative": {"stimulate": 3.0, "browse": 2.0, "study": 1.0, "game": 0.5},
    }
    weights = MOOD_WEIGHTS.get(mood, {})
    now = datetime.now(timezone.utc)

    # Decide whether to try YouTube (focused/bored → study, lazy/bored → browse)
    youtube_categories = {
        "focused": "study",
        "bored": "browse",
        "lazy": "browse",
        "creative": "study",
    }
    yt_category = youtube_categories.get(mood)

    # 40% chance to try YouTube when mood matches
    import random
    use_youtube = yt_category and random.random() < 0.4
    
    if use_youtube:
        yt_suggestion = await fetch_youtube_suggestion(yt_category)
        if yt_suggestion:
            return yt_suggestion

    # Fall back to DB items
    all_items = db.query(models.Item).all()

    filtered = []
    for item in all_items:
        if item.duration_minutes and item.duration_minutes > time:
            continue
        if item.skip_count >= 5:
            continue
        if item.last_suggested_at:
            last = item.last_suggested_at.replace(tzinfo=timezone.utc)
            minutes_ago = (now - last).total_seconds() / 60
            if minutes_ago < 30:
                continue
        filtered.append(item)

    if not filtered:
        return {"error": "No suggestions available right now. Try a longer time or wait a bit."}

    def score(item):
        mood_bonus = weights.get(item.category, 1.0)
        skip_penalty = item.skip_count * 0.5
        noise = random.uniform(0, 0.5)
        return mood_bonus - skip_penalty + noise

    best = sorted(filtered, key=score, reverse=True)[0]
    best.last_suggested_at = now.replace(tzinfo=None)
    db.commit()

    return {
        "id": best.id,
        "title": best.title,
        "category": best.category,
        "source": best.source,
        "duration_minutes": best.duration_minutes,
    }
    
@app.post("/feedback")
def feedback(payload: FeedbackRequest, db: Session = Depends(get_db)):
    #Check if item actually exists
    item = db.query(models.Item).filter(models.Item.id == payload.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    #If skipped, increment skip_count on the item
    if payload.action == "skip" :
        item.skip_count += 1
        db.commit()
        
    #Save the feedback record
    record = models.Feedback(
        item_id = payload.item_id,
        action = payload.action,
        mood = payload.mood,
        available_time = payload.available_time
    )
    db.add(record)
    db.commit()
    
    return {
        "status" : "ok",
        "action" : payload.action,
        "item_id" : payload.item_id
    }
    
# GET all items(for the ItemManager UI)
@app.get("/items")
def get_items(db: Session = Depends(get_db)):
    items = db.query(models.Item).order_by(models.Item.created_at.desc()).all()
    return [
        {
            "id" : i.id ,
            "title" : i.title ,
            "category" : i.category ,
            "duration_minutes" : i.duration_minutes ,
            "skip_count" : i.skip_count ,
            "source" : i.source ,
        }
        for i in items
    ]
    
# POST add a new item
@app.post("/items")
def add_item(payload: ItemCreate, db: Session = Depends(get_db)):
    item = models.Item(
        title = payload.title,
        category = payload.category,
        duration_minutes = payload.duration_minutes,
        url = payload.url,
        source = "manual"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "id" : item.id,
        "title" : item.title
    }
    
# DELETE an item
@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code = 404, detail = "Item not found")
    db.delete(item)
    db.commit()
    return {
        "status" : "deleted",
        "id" : item_id
    }
    
# PATCH reset skip count
@app.patch("/items/{item_id}/reset")
def reset_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code = 404, detail = "Item not found")
    item.skip_count = 0
    item.last_suggested_at = None
    db.commit()
    return {
        "status" : "reset",
        "id" : item_id
    }