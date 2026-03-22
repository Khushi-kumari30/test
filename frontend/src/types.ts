export type Decision = 'Recommended for Hiring' | 'Needs Training' | 'Not Suitable'
export type ConfidenceLevel = 'High' | 'Medium' | 'Low'
export type SkillStatus = 'strong' | 'weak' | 'missing'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type ImpactItem = { skill: string; impact_points: number }

export type ExplainableAI = {
  strong: ImpactItem[]
  weak: ImpactItem[]
  missing: ImpactItem[]
  notes: string[]
}

export type SkillEvaluation = {
  skill: string
  weight: number
  expected_level: number
  resume_level: number
  match_percent: number
  status: SkillStatus
}

export type AnalysisResult = {
  candidate_name: string
  role: string
  experience_level: string
  match_score: number
  time_to_productivity_weeks: number
  decision: Decision
  decision_explanation: string
  confidence_level: ConfidenceLevel
  risk_indicator: string
  one_line_insight: string
  skill_evaluations: SkillEvaluation[]
  missing_skills: string[]
  weak_skills: string[]
  explainable_ai: ExplainableAI
}

export type UploadParsed = {
  candidate_name: string
  role: string
  experience_level: string
  resume_text: string
  job_description_text: string
}

export type RoadmapWeek = { week_number: number; title: string; tasks: string[] }

export type RoadmapResponse = {
  weeks: RoadmapWeek[]
  estimated_time_to_productivity_weeks: number
}

