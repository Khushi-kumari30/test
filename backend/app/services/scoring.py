from __future__ import annotations

from typing import Iterable

from ..models import AnalysisResult, ConfidenceLevel, Decision, ExplainableAI, ImpactItem, SkillEvaluation, SkillStatus


STRONG_THRESHOLD = 75
WEAK_THRESHOLD = 45


def _match_percent(resume_level: int, expected_level: int) -> int:
    if expected_level <= 0:
        return 0
    # Coverage is the fraction of expected capability demonstrated by the resume.
    coverage = resume_level / float(expected_level)
    return max(0, min(100, int(round(coverage * 100))))


def _status_for(match_percent: int) -> SkillStatus:
    if match_percent >= STRONG_THRESHOLD:
        return "strong"
    if match_percent >= WEAK_THRESHOLD:
        return "weak"
    return "missing"


def estimate_time_to_productivity_weeks(missing_skills: Iterable[str], weak_skills: Iterable[str]) -> int:
    # Backward compatible stub (counts-based) kept for older internal callers.
    missing = list(missing_skills)
    weak = list(weak_skills)
    gaps = len(missing) + len(weak)
    if gaps == 0:
        return 2
    if gaps <= 2:
        return 3
    if gaps <= 5:
        return 4
    return 5


def estimate_time_from_match_score(match_score: int) -> int:
    """
    Deterministic proportional onboarding time derived from match_score.
    - score=0  -> ~6 weeks
    - score=100 -> ~2 weeks
    """
    base_weeks = 6
    min_weeks = 2
    span = base_weeks - min_weeks
    scaled = base_weeks - (match_score / 100.0) * span
    # Round to a whole week for UI simplicity.
    return max(min_weeks, min(base_weeks, int(round(scaled))))


def decision_for_match_score(match_score: int, missing_skills: list[str], weak_skills: list[str]) -> tuple[Decision, str]:
    if match_score > 80:
        if missing_skills:
            return "Recommended for Hiring", f"Overall match is high ({match_score}%) with only {len(missing_skills)} missing requirement(s)."
        return "Recommended for Hiring", f"Overall match is strong ({match_score}%) and aligns with most core requirements."
    if 60 <= match_score <= 80:
        if weak_skills:
            return "Needs Training", f"Match is {match_score}%. Candidate shows promising strengths but needs training in {', '.join(weak_skills[:3])}."
        return "Needs Training", f"Match is {match_score}%. Candidate requires targeted preparation to close remaining gaps."
    return "Not Suitable", f"Match is {match_score}%, indicating multiple gaps in key requirements ({', '.join((missing_skills or weak_skills)[:3])})."


def compute_explainable_ai(skill_evaluations: list[SkillEvaluation]) -> ExplainableAI:
    total_weight = sum(se.weight for se in skill_evaluations if se.expected_level > 0) or 1.0

    strong: list[ImpactItem] = []
    weak: list[ImpactItem] = []
    missing: list[ImpactItem] = []
    notes: list[str] = []

    for se in skill_evaluations:
        if se.expected_level <= 0:
            continue
        weight_share_points = se.weight / total_weight * 100
        if se.status == "strong":
            strong.append(ImpactItem(skill=se.skill, impact_points=int(round(weight_share_points))))
        elif se.status == "weak":
            # Partial coverage penalty relative to expectation.
            coverage = se.match_percent / 100.0
            penalty_points = weight_share_points * (1.0 - coverage)
            weak.append(ImpactItem(skill=se.skill, impact_points=-int(round(penalty_points))))
        else:
            missing.append(ImpactItem(skill=se.skill, impact_points=-int(round(weight_share_points))))

    # Sort for readability: biggest absolute impact first.
    strong.sort(key=lambda x: abs(x.impact_points), reverse=True)
    weak.sort(key=lambda x: abs(x.impact_points), reverse=True)
    missing.sort(key=lambda x: abs(x.impact_points), reverse=True)

    if not strong:
        notes.append("No strong evidence found across the most relevant JD skills; focus on building foundations first.")
    if missing:
        notes.append("Missing skills reduce the score most strongly because they represent unmet requirements in the job description.")

    return ExplainableAI(strong=strong, weak=weak, missing=missing, notes=notes)


def build_analysis(candidate_name: str, role: str, experience_level: str, skill_levels: dict[str, dict]) -> AnalysisResult:
    """
    skill_levels: dict[skill] = {"weight": float, "expected_level": int, "resume_level": int}
    Only skills with expected_level > 0 are treated as relevant.
    """
    # Build SkillEvaluation list for relevant skills.
    evaluations: list[SkillEvaluation] = []
    for skill, info in skill_levels.items():
        expected_level = int(info.get("expected_level") or 0)
        if expected_level <= 0:
            continue
        resume_level = int(info.get("resume_level") or 0)
        weight = float(info.get("weight") or 0)
        match = _match_percent(resume_level=resume_level, expected_level=expected_level)
        status = _status_for(match)
        evaluations.append(
            SkillEvaluation(
                skill=skill,
                weight=weight,
                expected_level=expected_level,
                resume_level=resume_level,
                match_percent=match,
                status=status,
            )
        )

    # If nothing relevant was detected, provide a safe fallback.
    if not evaluations:
        explain = ExplainableAI(notes=["No recognizable skills were detected from the job description; update the JD text for better results."])
        decision: Decision = "Not Suitable"
        return AnalysisResult(
            candidate_name=candidate_name,
            role=role,
            experience_level=experience_level,
            match_score=0,
            time_to_productivity_weeks=5,
            decision=decision,
            decision_explanation="Unable to compute a meaningful match score due to missing skill signals in the job description.",
            skill_evaluations=[],
            missing_skills=[],
            weak_skills=[],
            explainable_ai=explain,
        )

    total_weight = sum(se.weight for se in evaluations) or 1.0
    matched_weight = 0.0
    for se in evaluations:
        if se.expected_level > 0:
            matched_weight += se.weight * (se.resume_level / float(se.expected_level))
    match_score = int(round((matched_weight / total_weight) * 100))

    missing_skills = [se.skill for se in evaluations if se.status == "missing"]
    weak_skills = [se.skill for se in evaluations if se.status == "weak"]
    decision, decision_explanation = decision_for_match_score(match_score, missing_skills, weak_skills)

    explainable_ai = compute_explainable_ai(evaluations)
    time_to_productivity_weeks = estimate_time_from_match_score(match_score)

    # Decision intelligence layer (deterministic, derived only from analysis inputs).
    top_gap = missing_skills[0] if missing_skills else (weak_skills[0] if weak_skills else None)

    missing_count = len(missing_skills)
    weak_count = len(weak_skills)

    if match_score >= 85:
        confidence: ConfidenceLevel = "High"
    elif 60 <= match_score < 85 and missing_count <= 1:
        confidence = "Medium"
    else:
        confidence = "Low"

    if decision == "Not Suitable":
        risk_level = "High"
    elif missing_count >= 2:
        risk_level = "High"
    elif missing_count == 1 or weak_count >= 3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    skill_risk_phrase = {
        "Docker": "deployment workflow exposure",
        "System Design": "system architecture at scale",
        "AWS": "cloud deployment reliability experience",
        "SQL": "query optimization and data modeling depth",
        "Python": "core backend implementation depth",
        "Kubernetes": "production-grade orchestration readiness",
    }.get(top_gap or "", "")

    if not skill_risk_phrase and top_gap:
        skill_risk_phrase = f"{top_gap} readiness"

    risk_indicator = (
        f"Risk: {risk_level} - due to {skill_risk_phrase}"
        if (top_gap and skill_risk_phrase)
        else f"Risk: {risk_level}"
    )

    if decision == "Recommended for Hiring":
        one_line_insight = "Strong evidence for core requirements—expect a shorter ramp with focused onboarding."
    elif decision == "Needs Training":
        if top_gap:
            one_line_insight = f"Promising fit, but focus first on {top_gap} to improve role readiness."
        else:
            one_line_insight = "Promising fit with targeted training needed for remaining gaps."
    else:
        if top_gap:
            one_line_insight = f"Key requirements are not met yet (starting with {top_gap}); consider training or another candidate."
        else:
            one_line_insight = "Insufficient evidence for core job requirements."

    return AnalysisResult(
        candidate_name=candidate_name,
        role=role,
        experience_level=experience_level,
        match_score=max(0, min(100, match_score)),
        time_to_productivity_weeks=time_to_productivity_weeks,
        decision=decision,
        decision_explanation=decision_explanation,
        confidence_level=confidence,
        risk_indicator=risk_indicator,
        one_line_insight=one_line_insight,
        skill_evaluations=evaluations,
        missing_skills=missing_skills,
        weak_skills=weak_skills,
        explainable_ai=explainable_ai,
    )


def apply_simulation_to_analysis(analysis: AnalysisResult, added_skill: str, new_resume_level: int) -> AnalysisResult:
    updated_levels: dict[str, dict] = {}
    for se in analysis.skill_evaluations:
        updated_levels[se.skill] = {
            "weight": se.weight,
            "expected_level": se.expected_level,
            "resume_level": se.resume_level,
        }

    if added_skill in updated_levels:
        updated_levels[added_skill]["resume_level"] = int(new_resume_level)

    # Rebuild analysis from the updated resume levels.
    return build_analysis(
        candidate_name=analysis.candidate_name,
        role=analysis.role,
        experience_level=analysis.experience_level,
        skill_levels=updated_levels,
    )

