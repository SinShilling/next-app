from database import SessionLocal, Base, engine
from models import Item

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

items = [
    Item(title="Watch Fireship's React in 100 Seconds", category="study", duration_minutes=2),
    Item(title="Read about how Python async works", category="study", duration_minutes=15),
    Item(title="Browse mechanical keyboards on YouTube", category="browse", duration_minutes=20),
    Item(title="Play Lies of P for a bit", category="game", duration_minutes=45),
    Item(title="Window shop laptops on Flipkart", category="browse", duration_minutes=15),
    Item(title="Read about FastAPI dependency injection", category="study", duration_minutes=20),
    Item(title="Watch a GPU benchmark video", category="browse", duration_minutes=10),
    Item(title="Try a new game on Steam", category="game", duration_minutes=60),
    Item(title="Doodle or brainstorm something random", category="stimulate", duration_minutes=10),
    Item(title="Read one article on HackerNews", category="stimulate", duration_minutes=10),
]

db = SessionLocal()
db.add_all(items)
db.commit()
db.close()

print(f"Seeded {len(items)} items.")