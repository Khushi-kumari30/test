from __future__ import annotations

from ..models import RoadmapResponse
from .scoring import estimate_time_to_productivity_weeks


def _chunk(items: list[str], n: int) -> list[list[str]]:
    if n <= 0:
        return [[] for _ in range(0)]
    size = max(1, (len(items) + n - 1) // n)
    return [items[i : i + size] for i in range(0, len(items), size)]


def generate_roadmap(missing_skills: list[str], weak_skills: list[str]) -> RoadmapResponse:
    gaps = list(dict.fromkeys(missing_skills + weak_skills))  # stable de-dupe

    # Always create a 4-week plan for the UI.
    slots = _chunk(gaps, 4)
    while len(slots) < 4:
        slots.append([])

    def week_title(week_number: int) -> str:
        if week_number == 1:
            return "Foundations & Setup"
        if week_number == 2:
            return "Hands-On Implementation"
        if week_number == 3:
            return "Advanced Practice"
        return "Capstone & Interview Readiness"

    week_plans = []
    for week_number in range(1, 5):
        week_skills = slots[week_number - 1]
        tasks: list[str] = []

        tasks.append("Set up a learning workspace and align on success metrics for the role.")

        if week_number == 2:
            tasks.append("Build small, testable prototypes and document decisions (trade-offs, constraints, and outcomes).")
        elif week_number == 3:
            tasks.append("Increase complexity: add edge cases, performance considerations, and reliability checks.")
        elif week_number == 4:
            tasks.append("Deliver a capstone demonstration and run mock technical interviews with feedback loops.")

        for skill in week_skills:
            if skill in missing_skills:
                tasks.append(f"Week {week_number}: Start {skill} from basics and complete guided exercises.")
            else:
                tasks.append(f"Week {week_number}: Strengthen {skill} with role-relevant scenarios and deeper reviews.")

        # Ensure tasks are not empty for a UI that expects multiple lines.
        if len(tasks) < 4:
            tasks.append("Review JD expectations and create a short checklist of what to prove each week.")

        week_plans.append(
            {
                "week_number": week_number,
                "title": week_title(week_number),
                "tasks": tasks[:7],
            }
        )

    estimated_time_to_productivity_weeks = estimate_time_to_productivity_weeks(missing_skills, weak_skills)
    return RoadmapResponse(weeks=week_plans, estimated_time_to_productivity_weeks=estimated_time_to_productivity_weeks)

