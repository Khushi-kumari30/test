import { AnalysisResult, RoadmapResponse, SkillLevel, UploadParsed } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed: ${res.status} ${text}`)
  }
  return (await res.json()) as T
}

export async function uploadFiles(resumeFile: File, jdFile: File): Promise<UploadParsed> {
  const fd = new FormData()
  fd.append('resume', resumeFile)
  fd.append('jd', jdFile)

  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const data = (await res.json()) as { parsed: UploadParsed }
  return data.parsed
}

export async function analyze(parsed: UploadParsed): Promise<AnalysisResult> {
  const res = await postJson<{ analysis: AnalysisResult }>('/analyze', {
    candidate_name: parsed.candidate_name,
    role: parsed.role,
    experience_level: parsed.experience_level,
    resume_text: parsed.resume_text,
    job_description_text: parsed.job_description_text,
  })
  return res.analysis
}

export async function generateRoadmap(missing_skills: string[], weak_skills: string[]): Promise<RoadmapResponse> {
  return postJson<RoadmapResponse>('/roadmap', { missing_skills, weak_skills })
}

export async function simulateImpact(
  analysis: AnalysisResult,
  added_skill: string,
  level: SkillLevel,
): Promise<{ updated_analysis: AnalysisResult; simulated_impact: string }> {
  return postJson<{ updated_analysis: AnalysisResult; simulated_impact: string }>('/simulate', {
    analysis,
    added_skill,
    level,
  })
}

export async function chat(message: string, analysis: AnalysisResult | null): Promise<{ reply: string }> {
  const res = await postJson<{ reply: string; suggestions: string[]; confidence: string }>('/chat', {
    message,
    analysis,
  })
  return { reply: res.reply }
}

