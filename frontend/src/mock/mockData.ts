import { AnalysisResult, RoadmapResponse } from '../types'

const mockAnalysis: AnalysisResult = {
  candidate_name: 'Alex Johnson',
  role: 'Senior Backend Engineer',
  experience_level: 'Senior',
  match_score: 72,
  time_to_productivity_weeks: 4,
  decision: 'Needs Training',
  decision_explanation: 'Match is 72%. Candidate shows promising strengths but needs training in System Design and Docker.',
  confidence_level: 'Medium',
  risk_indicator: 'Risk: Medium — due to deployment workflows exposure',
  one_line_insight: 'Promising fit, but focus first on Docker to improve role readiness.',
  missing_skills: ['Docker'],
  weak_skills: ['System Design', 'AWS'],
  skill_evaluations: [
    { skill: 'Python', weight: 1.8, expected_level: 90, resume_level: 85, match_percent: 94, status: 'strong' },
    { skill: 'SQL', weight: 1.4, expected_level: 80, resume_level: 70, match_percent: 88, status: 'strong' },
    { skill: 'System Design', weight: 1.6, expected_level: 85, resume_level: 50, match_percent: 59, status: 'weak' },
    { skill: 'AWS', weight: 1.3, expected_level: 80, resume_level: 45, match_percent: 56, status: 'weak' },
    { skill: 'Docker', weight: 1.2, expected_level: 75, resume_level: 0, match_percent: 0, status: 'missing' },
    { skill: 'CI/CD', weight: 0.9, expected_level: 70, resume_level: 55, match_percent: 79, status: 'strong' },
  ],
  explainable_ai: {
    strong: [
      { skill: 'Python', impact_points: 30 },
      { skill: 'SQL', impact_points: 25 },
      { skill: 'CI/CD', impact_points: 10 },
    ],
    weak: [
      { skill: 'System Design', impact_points: -10 },
      { skill: 'AWS', impact_points: -8 },
    ],
    missing: [{ skill: 'Docker', impact_points: -20 }],
    notes: ['Missing skills reduce the score the most because they represent unmet requirements in the job description.'],
  },
}

const mockRoadmap: RoadmapResponse = {
  estimated_time_to_productivity_weeks: 4,
  weeks: [
    {
      week_number: 1,
      title: 'Foundations & Setup',
      tasks: [
        'Set up a learning workspace and align on success metrics for the role.',
        'Week 1: Start Docker from basics and complete guided exercises.',
        'Week 1: Strengthen System Design with role-relevant scenarios and deeper reviews.',
        'Review JD expectations and create a short checklist of what to prove each week.',
      ],
    },
    {
      week_number: 2,
      title: 'Hands-On Implementation',
      tasks: [
        'Build small, testable prototypes and document decisions (trade-offs, constraints, and outcomes).',
        'Week 2: Start Docker from basics and complete guided exercises.',
        'Week 2: Strengthen AWS with role-relevant scenarios and deeper reviews.',
      ],
    },
    {
      week_number: 3,
      title: 'Advanced Practice',
      tasks: [
        'Increase complexity: add edge cases, performance considerations, and reliability checks.',
        'Week 3: Strengthen System Design with role-relevant scenarios and deeper reviews.',
        'Week 3: Strengthen AWS with role-relevant scenarios and deeper reviews.',
      ],
    },
    {
      week_number: 4,
      title: 'Capstone & Interview Readiness',
      tasks: [
        'Deliver a capstone demonstration and run mock technical interviews with feedback loops.',
        'Week 4: Start Docker from basics and complete guided exercises.',
        'Week 4: Strengthen System Design with role-relevant scenarios and deeper reviews.',
      ],
    },
  ],
}

export default {
  mockAnalysis,
  mockRoadmap,
}

