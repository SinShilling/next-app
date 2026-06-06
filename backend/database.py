from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# This creates (or connects to) a file called next.db in your backend folder
# Same idea as a connection string in C#

DATABASE_URL = "sqlite:///./next.db"

engine = create_engine(
    DATABASE_URL,
    connect_args = {"check_same_thread" : False}  # needed for SQLite + FastAPI
)

SessionLocal = sessionmaker(bind = engine)

# All models will inherit from this base class

class Base(DeclarativeBase):
    pass

# Dependency — gives a DB session to each request, closes it after

def get_db():
    db = SessionLocal()
    try :
        yield db
    finally :
        db.close()