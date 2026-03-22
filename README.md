# AI Adaptive Hiring & Onboarding Engine

Modern SaaS-style web app for adaptive hiring and onboarding.

## Stack
- Frontend: React + Tailwind CSS
- Backend: Python + FastAPI

## Project Layout
- `backend/` FastAPI API
- `frontend/` React UI

## Prerequisites
- Node.js (for frontend)
- Python 3.10+ (for backend)

## Run Backend
1. Open a terminal in `backend/`
2. Create and activate a virtual environment:
   - PowerShell:
     - `python -m venv .venv`
     - `.\.venv\Scripts\Activate.ps1`
3. Install deps:
   - `pip install -r requirements.txt`
4. Start API:
   - `uvicorn app.main:app --reload --port 8000`

## Run Frontend
1. Open a terminal in `frontend/`
2. Install deps:
   - `npm install`
3. Start dev server:
   - `npm run dev`

## Use the App
- Open the frontend URL shown by `npm run dev` (usually `http://localhost:5173`)
- Paste a Job Description and upload a Resume PDF
- The dashboard shows match score, skill gaps, explainable AI, decision, roadmap, and what-if simulation
- Use the floating chat widget for guided answers

## Notes
- Resume parsing is best-effort: the app attempts PDF text extraction and falls back to lightweight heuristics if text extraction fails.
- Skill scoring is rule-based (weights + keyword evidence) to keep the demo fully self-contained.

## Mock Backend Test (No PDF Needed)
- You can POST directly to `/analyze` using:
  - `backend/sample/mock_analyze_input.json`

