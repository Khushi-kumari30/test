from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SkillDefinition:
    weight: float
    keywords: tuple[str, ...]
    strong_keywords: tuple[str, ...]
    expected_level_boosters: tuple[str, ...] = ()


SKILLS: dict[str, SkillDefinition] = {
    "Python": SkillDefinition(
        weight=1.8,
        keywords=("python", "fastapi", "django", "pandas", "numpy", "flask", "requests", "celery"),
        strong_keywords=("distributed", "ml", "optimiz", "async", "type hint", "typing", "pytest", "profil"),
        expected_level_boosters=("expert", "must", "required"),
    ),
    "SQL": SkillDefinition(
        weight=1.4,
        keywords=("sql", "postgres", "mysql", "t-sql", "query", "joins", "indexes", "window"),
        strong_keywords=("performance", "explain", "partition", "materialized view", "etl", "data warehouse"),
        expected_level_boosters=("expert", "must", "required"),
    ),
    "Docker": SkillDefinition(
        weight=1.2,
        keywords=("docker", "container", "compose", "image", "dockerfile"),
        strong_keywords=("kubernetes", "multi-stage", "build cache", "security", "sbom"),
        expected_level_boosters=("must", "required"),
    ),
    "System Design": SkillDefinition(
        weight=1.6,
        keywords=("system design", "architecture", "scalability", "latency", "throughput", "reliability"),
        strong_keywords=("distributed systems", "event-driven", "saga", "idempotent", "cqrs", "ddd"),
        expected_level_boosters=("expert", "must", "required", "lead"),
    ),
    "Kubernetes": SkillDefinition(
        weight=1.1,
        keywords=("kubernetes", "k8s", "helm", "pod", "service", "ingress"),
        strong_keywords=("autoscaling", "cluster", "rbac", "network policy", "statefulset"),
        expected_level_boosters=("must", "required"),
    ),
    "AWS": SkillDefinition(
        weight=1.3,
        keywords=("aws", "lambda", "s3", "ec2", "cloudfront", "iam", "dynamodb", "rds"),
        strong_keywords=("vpc", "cloudformation", "step functions", "ecr", "eks", "athena"),
        expected_level_boosters=("expert", "must", "required"),
    ),
    "React": SkillDefinition(
        weight=1.0,
        keywords=("react", "jsx", "hooks", "components", "frontend"),
        strong_keywords=("performance", "concurrency", "testing library", "msw"),
        expected_level_boosters=("must", "required"),
    ),
    "TypeScript": SkillDefinition(
        weight=0.95,
        keywords=("typescript", "ts", "interfaces", "generics", "typed"),
        strong_keywords=("strict", "type guards", "runtime validation", "zod"),
        expected_level_boosters=("must", "required"),
    ),
    "CI/CD": SkillDefinition(
        weight=0.9,
        keywords=("ci/cd", "jenkins", "github actions", "pipelines", "workflow", "release"),
        strong_keywords=("blue-green", "canary", "artifacts", "signed", "sast", "dependency scanning"),
        expected_level_boosters=("must", "required"),
    ),
    "Testing": SkillDefinition(
        weight=0.85,
        keywords=("pytest", "unittest", "jest", "cypress", "testing", "test cases"),
        strong_keywords=("tdd", "coverage", "integration tests", "contract tests"),
        expected_level_boosters=("must", "required"),
    ),
    "Data Engineering": SkillDefinition(
        weight=1.0,
        keywords=("etl", "data pipeline", "airflow", "spark", "databricks", "warehouse", "modeling"),
        strong_keywords=("orchestration", "dbt", "slowly changing", "cdc", "streaming"),
        expected_level_boosters=("must", "required"),
    ),
}


def normalize_text(text: str) -> str:
    return " ".join((text or "").lower().split())


def count_keyword_bundles(text: str, keywords: tuple[str, ...]) -> int:
    """
    Counts how many unique keywords/bundles appear in the text.
    This avoids over-rewarding repeated mentions.
    """
    t = normalize_text(text)
    count = 0
    for kw in keywords:
        if kw.strip() and kw in t:
            count += 1
    return count


def jd_booster_present(jd_text: str, boosters: tuple[str, ...]) -> bool:
    t = normalize_text(jd_text)
    return any(b.strip() and b in t for b in boosters)

