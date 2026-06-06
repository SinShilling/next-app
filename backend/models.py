from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    source = Column(String, default="manual")
    url = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    skip_count = Column(Integer, default=0)
    last_suggested_at = Column(DateTime, nullable=True)   # ← new
    created_at = Column(DateTime, default=func.now())


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    mood = Column(String, nullable=True)
    available_time = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=func.now())