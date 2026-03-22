from __future__ import annotations

import os

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse, RoadmapRequest, RoadmapResponse, SimulateRequest, SimulateResponse, UploadResponse
from .services.chat import generate_chat_reply
from .services.scoring import build_analysis
from .services.simulator import simulate
from .services.skill_extractor import extract_candidate_name, extract_experience_level, extract_role_from_jd, extract_skill_levels
from .services.roadmap import generate_roadmap
from .utils.pdf_parser import extract_text_from_pdf


app = FastAPI(title="AI Adaptive Hiring & Onboarding Engine", version="0.1.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/upload", response_model=UploadResponse)
def upload_resume(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...),
) -> UploadResponse:
    resume_name = (resume.filename or "").lower()
    jd_name = (jd.filename or "").lower()

    if not resume_name.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Resume must be a PDF file.")

    if not jd_name.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Job description (JD) must be a PDF file.")

    resume_text = extract_text_from_pdf(resume)
    jd_text = extract_text_from_pdf(jd)

    candidate_name = extract_candidate_name(resume.filename)
    role = extract_role_from_jd(jd_text)
    experience_level = extract_experience_level(jd_text)

    return UploadResponse(
        parsed={
            "candidate_name": candidate_name,
            "role": role,
            "experience_level": experience_level,
            "resume_text": resume_text,
            "job_description_text": jd_text,
        }
    )


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    skill_levels = extract_skill_levels(
        resume_text=request.resume_text,
        job_description_text=request.job_description_text,
    )
    analysis = build_analysis(
        candidate_name=request.candidate_name,
        role=request.role,
        experience_level=request.experience_level,
        skill_levels=skill_levels,
    )
    return AnalyzeResponse(analysis=analysis)


@app.post("/roadmap", response_model=RoadmapResponse)
def roadmap(request: RoadmapRequest) -> RoadmapResponse:
    return generate_roadmap(
        missing_skills=request.missing_skills,
        weak_skills=request.weak_skills,
    )


@app.post("/simulate", response_model=SimulateResponse)
def simulate_impact(request: SimulateRequest) -> SimulateResponse:
    updated_analysis, impact = simulate(
        analysis=request.analysis,
        added_skill=request.added_skill,
        level=request.level,
    )
    return SimulateResponse(updated_analysis=updated_analysis, simulated_impact=impact)


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    reply, suggestions, confidence = generate_chat_reply(request.message, request.analysis)
    return ChatResponse(reply=reply, suggestions=suggestions, confidence=confidence)

