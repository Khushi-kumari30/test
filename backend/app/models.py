from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field

Decision = Literal["Recommended for Hiring", "Needs Training", "Not Suitable"]
ConfidenceLevel = Literal["High", "Medium", "Low"]
SkillStatus = Literal["strong", "weak", "missing"]
SkillLevel = Literal["Beginner", "Intermediate", "Advanced"]


class ParsedUpload(BaseModel):
    candidate_name: str
    role: str
    experience_level: str
    resume_text: str
    job_description_text: str


class UploadResponse(BaseModel):
    parsed: ParsedUpload


class SkillEvaluation(BaseModel):
    skill: str
    weight: float = Field(..., ge=0)
    expected_level: int = Field(..., ge=0, le=100)
    resume_level: int = Field(..., ge=0, le=100)
    match_percent: int = Field(..., ge=0, le=100)
    status: SkillStatus


class ImpactItem(BaseModel):
    skill: str
    impact_points: int


class ExplainableAI(BaseModel):
    strong: list[ImpactItem] = []
    weak: list[ImpactItem] = []
    missing: list[ImpactItem] = []
    notes: list[str] = []


class AnalysisResult(BaseModel):
    candidate_name: str
    role: str
    experience_level: str
    match_score: int = Field(..., ge=0, le=100)
    time_to_productivity_weeks: int = Field(..., ge=0, le=12)
    decision: Decision
    decision_explanation: str
    confidence_level: ConfidenceLevel
    risk_indicator: str
    one_line_insight: str
    skill_evaluations: list[SkillEvaluation]
    missing_skills: list[str]
    weak_skills: list[str]
    explainable_ai: ExplainableAI


class AnalyzeRequest(BaseModel):
    candidate_name: str
    role: str
    experience_level: str
    resume_text: str
    job_description_text: str


class AnalyzeResponse(BaseModel):
    analysis: AnalysisResult


class RoadmapWeek(BaseModel):
    week_number: int = Field(..., ge=1, le=4)
    title: str
    tasks: list[str]


class RoadmapResponse(BaseModel):
    weeks: list[RoadmapWeek]
    estimated_time_to_productivity_weeks: int = Field(..., ge=0, le=12)


class RoadmapRequest(BaseModel):
    missing_skills: list[str]
    weak_skills: list[str]


class SimulateRequest(BaseModel):
    analysis: AnalysisResult
    added_skill: str
    level: SkillLevel


class SimulateResponse(BaseModel):
    updated_analysis: AnalysisResult
    simulated_impact: str


class ChatRequest(BaseModel):
    message: str
    analysis: Optional[AnalysisResult] = None


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str] = []
    confidence: Literal["low", "medium", "high"] = "medium"

