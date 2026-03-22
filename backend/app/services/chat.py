from __future__ import annotations

import re

from ..models import AnalysisResult


def _safe_join(skills: list[str], limit: int = 5) -> str:
    if not skills:
        return "None"
    return ", ".join(skills[:limit]) + ("" if len(skills) <= limit else ", ...")


def generate_chat_reply(message: str, analysis: AnalysisResult | None) -> tuple[str, list[str], str]:
    msg = (message or "").strip().lower()

    if not analysis:
        return (
            "Upload a resume and job description first, then I can answer using the computed match score and skill gaps.",
            ["Upload resume + JD", "Run Analyze", "Ask about hiring decision or missing skills"],
            "low",
        )

    missing = analysis.missing_skills
    weak = analysis.weak_skills
    decision = analysis.decision
    time_weeks = analysis.time_to_productivity_weeks

    if re.search(r"\bshould i\b|\bhire\b|\brecommended\b|\bdecision\b", msg):
        if decision == "Recommended for Hiring":
            reply = f"Yes—recommended for hiring (match score: {analysis.match_score}%, confidence: {analysis.confidence_level}). {analysis.one_line_insight}"
        elif decision == "Needs Training":
            reply = f"Not yet—needs training first (match score: {analysis.match_score}%, confidence: {analysis.confidence_level}). {analysis.one_line_insight}"
        else:
            reply = f"No—not suitable today (match score: {analysis.match_score}%, confidence: {analysis.confidence_level}). {analysis.one_line_insight}"
        return reply, ["Check the top gaps in the dashboard", "Use What-If to estimate impact"], "high"

    if re.search(r"\bmissing\b|\bwhat skills are missing\b|\bgaps\b", msg):
        reply_parts = []
        if missing:
            reply_parts.append(f"Missing: {_safe_join(missing)}.")
        if weak:
            reply_parts.append(f"Weak: {_safe_join(weak)}.")
        if not reply_parts:
            reply_parts.append("No missing/weak signals detected for the core requirements.")
        reply = " ".join(reply_parts)
        return reply, ["Simulate closing a gap with What-If", "Review skill evidence for the top missing item"], "high"

    if re.search(r"\bhow long\b|\bjob[- ]ready\b|\bjob readiness\b|\bjob[- ]ready\b|\btime\b|\bproductivity\b", msg):
        return (
            f"Estimated time to job-ready is about {time_weeks} week(s). {analysis.risk_indicator}",
            ["Use What-If to see how adding one gap changes the timeline"],
            "medium",
        )

    if re.search(r"train first|what should we train|what should we train first|what to train first|training priority", msg):
        priority = missing[0] if missing else (weak[0] if weak else None)
        if priority:
            return (
                f"Train first: {priority}. It’s the biggest driver of the current readiness score. {analysis.one_line_insight}",
                ["After training, run What-If to confirm match score lift"],
                "high",
            )
        return (
            f"Nothing critical is missing. Focus on strengthening weaker areas only if you need faster ramp. {analysis.one_line_insight}",
            ["Use What-If to test how improvements affect decision and timeline"],
            "medium",
        )

    # Default helpful answer
    return (
        f"Decision: {decision} (match score: {analysis.match_score}%, confidence: {analysis.confidence_level}). {analysis.one_line_insight}",
        ["Try: “What skills are missing?”", "Try: “What should we train first?”"],
        "medium",
    )

