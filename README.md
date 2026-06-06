# NEXT — Personal Brain Feed Engine

A full-stack productivity app that tells you exactly what to do next based on your current mood and available time.

Built with **FastAPI + Python** on the backend and **React + Vite + Tailwind** on the frontend.

## The Problem

Decision fatigue. You open YouTube, browse for 20 minutes, find nothing. You don't know whether to study, game, or just do something mindless. NEXT solves this by giving you one specific, actionable suggestion instantly.

## Features

- **Mood-aware suggestions** — picks activities suited to how you're feeling (Focused, Lazy, Bored, Creative)
- **Time filter** — only suggests things that fit your available time
- **Learns your preferences** — tracks skips and deprioritizes things you keep ignoring
- **Skip threshold** — hides items you've skipped 5+ times
- **Recency filter** — won't suggest the same thing twice within 30 minutes
- **Item manager** — add, delete, and reset your own activities through a UI

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.x |
| Database | SQLite + SQLAlchemy ORM |
| API communication | REST (fetch) |

## Project Structure

next-app/
├── backend/
│   ├── main.py        # FastAPI app, all routes
│   ├── models.py      # SQLAlchemy DB models
│   ├── database.py    # DB connection + session
│   └── seed.py        # Seed initial items
└── frontend/
└── src/
├── App.jsx
├── api.js
└── components/
├── MoodSelector.jsx
├── SpinCard.jsx
└── ItemManager.jsx

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Roadmap

- [ ] Steam API integration — pull your actual game library
- [ ] YouTube API integration — suggest real videos by topic
- [ ] History panel — see what you've done recently
- [ ] PWA support — use it on mobile