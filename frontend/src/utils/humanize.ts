import { AnalysisResult } from '../types'

type Decision = AnalysisResult['decision']

const SKILL_DESCRIPTIONS: Record<string, string> = {
  Python: 'core backend development and API building',
  SQL: 'querying and performance tuning of data',
  Docker: 'deployment workflows using containers',
  'System Design': 'architecture trade-offs and reliability at scale',
  Kubernetes: 'production-grade orchestration and deployments',
  AWS: 'cloud services for storage, compute, and reliability',
  React: 'frontend UI composition and interactive experiences',
  TypeScript: 'type-safe frontend code and maintainable APIs',
  'CI/CD': 'release automation and safe delivery pipelines',
  Testing: 'confidence through automated tests and quality gates',
  'Data Engineering': 'building and maintaining data pipelines',
}

export function skillDescription(skill: string) {
  return SKILL_DESCRIPTIONS[skill] || 'role-relevant responsibilities'
}

export function decisionTone(decision: Decision) {
  if (decision === 'Recommended for Hiring') return { pill: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Ready to hire' }
  if (decision === 'Needs Training') return { pill: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Train & ramp' }
  return { pill: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Not a fit yet' }
}

export function decisionHeadline(analysis: AnalysisResult) {
  const { decision } = analysis
  if (decision === 'Recommended for Hiring') {
    return 'Strong match for the role'
  }
  if (decision === 'Needs Training') {
    const topGap = analysis.missing_skills[0] || analysis.weak_skills[0]
    return topGap ? `Strong potential—prioritize ${topGap}` : 'Promising, with targeted gaps'
  }
  const topGap = analysis.missing_skills[0] || analysis.weak_skills[0]
  return topGap ? `Key requirements are missing (${topGap})` : 'Key requirements are missing'
}

export function decisionInsight(analysis: AnalysisResult) {
  const missing = analysis.missing_skills
  const weak = analysis.weak_skills

  if (analysis.decision === 'Recommended for Hiring') {
    return `The candidate’s strengths line up with your job requirements. With light onboarding, they should ramp quickly.`
  }

  if (analysis.decision === 'Needs Training') {
    const primaryMissing = missing[0]
    const primaryWeak = weak[0]
    if (primaryMissing) {
      return `They’re missing ${primaryMissing}, which is important because it covers ${skillDescription(primaryMissing)}. Address this first, then strengthen the weaker areas.`
    }
    if (primaryWeak) {
      return `They are not fully ready yet in ${primaryWeak}. Improve coverage in ${skillDescription(primaryWeak)} to raise readiness.`
    }
    return `They need targeted preparation to close remaining gaps and improve confidence for the role.`
  }

  const primaryMissing = missing[0]
  if (primaryMissing) {
    return `Several required signals are missing—starting with ${primaryMissing} (${skillDescription(primaryMissing)}). Training may help, but this profile is not yet sufficient for the role today.`
  }
  const primaryWeak = weak[0]
  if (primaryWeak) {
    return `The candidate’s evidence is weak across key areas (including ${primaryWeak}). Consider a different candidate or a longer training track.`
  }
  return `The profile does not provide enough evidence for core job requirements.`
}

export function topExplainableReasons(analysis: AnalysisResult) {
  const { explainable_ai } = analysis

  // Pick a small, decision-useful subset: 2 strong, 1 missing, 1 weak.
  const strong = [...explainable_ai.strong].sort((a, b) => Math.abs(b.impact_points) - Math.abs(a.impact_points)).slice(0, 2)
  const missing = [...explainable_ai.missing].sort((a, b) => Math.abs(b.impact_points) - Math.abs(a.impact_points)).slice(0, 1)
  const weak = [...explainable_ai.weak].sort((a, b) => Math.abs(b.impact_points) - Math.abs(a.impact_points)).slice(0, 1)

  return { strong, missing, weak }
}

