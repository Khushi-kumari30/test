import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import Card from '../components/ui/Card'
import PdfDropZone from '../components/landing/PdfDropZone'
import { analyze, generateRoadmap, uploadFiles } from '../api/client'
import { RoadmapResponse, AnalysisResult } from '../types'
import { saveDashboardStore, clearDashboardStore } from '../utils/dashboardStorage'

export default function UploadPage() {
  const navigate = useNavigate()

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stateHint = useMemo(() => {
    const r = resumeFile ? `Resume: ${resumeFile.name}` : 'Resume: not uploaded'
    const j = jdFile ? `JD: ${jdFile.name}` : 'JD: not uploaded'
    return `${r} • ${j}`
  }, [resumeFile, jdFile])

  async function handleAnalyze() {
    setError(null)
    if (!resumeFile) return setError('Please upload a resume PDF.')
    if (!jdFile) return setError('Please upload a job description (JD) PDF.')

    setBusy(true)
    try {
      const parsed = await uploadFiles(resumeFile, jdFile)
      const analysis: AnalysisResult = await analyze(parsed)
      const roadmap: RoadmapResponse = await generateRoadmap(analysis.missing_skills, analysis.weak_skills)

      saveDashboardStore({ analysis, roadmap })
      navigate('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload/analysis failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">AI Adaptive Hiring & Onboarding Engine</div>
            <div className="mt-2 text-sm text-gray-600">{stateHint}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearDashboardStore()
              navigate('/')
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to Landing
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card title="Upload PDFs" subtitle="Resume + Job Description (JD) as PDFs. Then we generate the match score, gaps, and a 4-week roadmap.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-semibold text-gray-900">Resume (PDF)</div>
                    <PdfDropZone
                      disabled={busy}
                      hint="Drag & drop Resume (PDF) or click to upload"
                      onFiles={(files: File[]) => {
                        setResumeFile(files[0] || null)
                      }}
                    />
                    <div className="mt-3 text-xs text-gray-500">{resumeFile ? `Selected: ${resumeFile.name}` : 'No resume selected'}</div>
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-semibold text-gray-900">Job Description (JD) (PDF)</div>
                    <PdfDropZone
                      disabled={busy}
                      hint="Drag & drop JD (PDF) or click to upload"
                      onFiles={(files: File[]) => {
                        setJdFile(files[0] || null)
                      }}
                    />
                    <div className="mt-3 text-xs text-gray-500">{jdFile ? `Selected: ${jdFile.name}` : 'No JD selected'}</div>
                  </div>
                </div>

                {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500">
                    We extract text from your PDFs and run weighted keyword match scoring.
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleAnalyze}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {busy ? 'Analyzing...' : 'Analyze Candidate'}
                  </button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card title="What you get" subtitle="A SaaS-style hiring analysis with explainable scoring and simulation.">
                <ul className="mt-2 space-y-3 text-sm text-gray-700">
                  <li className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <span className="font-semibold text-gray-900">Candidate match score</span>
                    <div className="mt-1 text-gray-600">Weighted by relevance to your JD.</div>
                  </li>
                  <li className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <span className="font-semibold text-gray-900">Skill gaps & weak skills</span>
                    <div className="mt-1 text-gray-600">Highlighted with clear severity color coding.</div>
                  </li>
                  <li className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <span className="font-semibold text-gray-900">What-If simulation</span>
                    <div className="mt-1 text-gray-600">Simulate adding a missing skill to estimate impact.</div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

