from __future__ import annotations

import re
from pathlib import Path

from ..utils.skills_catalog import SKILLS, SkillDefinition, count_keyword_bundles, jd_booster_present


def _clean_name(name: str) -> str:
    s = re.sub(r"[_\-]+", " ", (name or "")).strip()
    s = re.sub(r"\s+", " ", s)
    return s.title() if s else "Candidate"


def extract_candidate_name(resume_filename: str) -> str:
    stem = Path(resume_filename or "candidate.pdf").stem
    return _clean_name(stem)


def extract_role_from_jd(job_description_text: str) -> str:
    jd = (job_description_text or "").strip()
    if not jd:
        return "Unknown Role"

    # Prefer explicit patterns like "Job Title: ..."
    for pattern in (r"job title\s*:\s*(.+)", r"role\s*:\s*(.+)", r"position\s*:\s*(.+)"):
        m = re.search(pattern, jd, flags=re.IGNORECASE)
        if m:
            role = m.group(1).strip()
            return role[:80] if role else "Unknown Role"

    # Fallback: first non-empty line
    for line in jd.splitlines():
        line = line.strip()
        if line:
            return line[:80]
    return "Unknown Role"


def extract_experience_level(job_description_text: str) -> str:
    t = (job_description_text or "").lower()
    if any(k in t for k in ("principal", "staff", "lead", "senior")):
        return "Senior"
    if any(k in t for k in ("junior", "entry", "associate", "beginner")):
        return "Junior"
    if any(k in t for k in ("mid-level", "mid level", "mid", "intermediate")):
        return "Mid"
    return "Mid"


def _evidence_to_resume_level(defn: SkillDefinition, evidence_count: int, strong_evidence_count: int) -> int:
    if evidence_count <= 0:
        return 0
    if strong_evidence_count >= 2:
        return 90
    if evidence_count >= 4:
        return 85
    if evidence_count >= 2:
        return 75
    return 55


def _evidence_to_expected_level(defn: SkillDefinition, evidence_count: int, strong_evidence_count: int, jd_text: str) -> int:
    if evidence_count <= 0:
        return 0

    booster = 10 if jd_booster_present(jd_text, defn.expected_level_boosters) else 0

    base = 70
    if strong_evidence_count >= 2:
        base = 95
    elif evidence_count >= 4:
        base = 90
    elif evidence_count >= 2:
        base = 80
    else:
        base = 70
    return min(100, base + booster)


def extract_skill_levels(resume_text: str, job_description_text: str) -> dict[str, dict]:
    """
    Returns a dict keyed by skill name with:
    - expected_level: 0..100 from JD evidence
    - resume_level: 0..100 from resume evidence
    - weight: relative importance
    """
    levels: dict[str, dict] = {}
    for skill_name, defn in SKILLS.items():
        resume_evidence = count_keyword_bundles(resume_text, defn.keywords)
        resume_strong_evidence = count_keyword_bundles(resume_text, defn.strong_keywords)
        jd_evidence = count_keyword_bundles(job_description_text, defn.keywords)
        jd_strong_evidence = count_keyword_bundles(job_description_text, defn.strong_keywords)

        resume_level = _evidence_to_resume_level(defn, resume_evidence, resume_strong_evidence)
        expected_level = _evidence_to_expected_level(defn, jd_evidence, jd_strong_evidence, job_description_text)

        levels[skill_name] = {
            "weight": float(defn.weight),
            "expected_level": int(expected_level),
            "resume_level": int(resume_level),
        }
    return levels

