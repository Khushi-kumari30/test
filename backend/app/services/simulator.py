from __future__ import annotations

from ..models import AnalysisResult, SkillLevel
from .scoring import apply_simulation_to_analysis


LEVEL_TO_RESUME_LEVEL: dict[SkillLevel, int] = {
    "Beginner": 50,
    "Intermediate": 70,
    "Advanced": 90,
}


def simulate(analysis: AnalysisResult, added_skill: str, level: SkillLevel) -> tuple[AnalysisResult, str]:
    new_resume_level = LEVEL_TO_RESUME_LEVEL[level]

    updated = apply_simulation_to_analysis(
        analysis=analysis,
        added_skill=added_skill,
        new_resume_level=new_resume_level,
    )

    old_score = analysis.match_score
    new_score = updated.match_score
    delta = new_score - old_score

    old_decision = analysis.decision
    new_decision = updated.decision

    simulated_impact = (
        f"Simulated learning impact: {added_skill} -> {level}. "
        f"Match score changed from {old_score}% to {new_score}% ({delta:+d} pts). "
        f"Decision: {old_decision} -> {new_decision}."
    )
    return updated, simulated_impact

