import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { chat, generateRoadmap, simulateImpact } from '../api/client'
import ChatWidget from '../components/ChatWidget'
import RoadmapSection from '../components/dashboard/RoadmapSection'
import DashboardSummary from '../components/dashboard/DashboardSummary'
import GapsAndInsightsPanel from '../components/dashboard/GapsAndInsightsPanel'
import WhatIfSimulationPanel from '../components/dashboard/WhatIfSimulationPanel'
import DecisionIntelligencePanel from '../components/dashboard/DecisionIntelligencePanel'
import ProductivityCard from '../components/dashboard/ProductivityCard'
import SkillOverviewCompact from '../components/dashboard/SkillOverviewCompact'
import { AnalysisResult, RoadmapResponse, SkillLevel } from '../types'
import { clearDashboardStore, loadDashboardStore, saveDashboardStore } from '../utils/dashboardStorage'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrating, setHydrating] = useState(true)

  useEffect(() => {
    const store = loadDashboardStore()
    if (!store) {
      navigate('/')
      return
    }
    setAnalysis(store.analysis)
    setRoadmap(store.roadmap)
    setHydrating(false)
  }, [navigate])

  useEffect(() => {
    // If redirect happened, don't leave the user on a blank screen.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (analysis && roadmap) setHydrating(false)
  }, [analysis, roadmap])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const dashboardReady = !!analysis && !!roadmap

  async function handleSimulate(addedSkill: string, level: SkillLevel) {
    if (!analysis || !roadmap) return null
    const prevMatchScore = analysis.match_score
    const prevTimeWeeks = analysis.time_to_productivity_weeks

    setBusy(true)
    setError(null)
    try {
      const res = await simulateImpact(analysis, addedSkill, level)
      const updatedAnalysis = res.updated_analysis
      const updatedRoadmap = await generateRoadmap(updatedAnalysis.missing_skills, updatedAnalysis.weak_skills)
      setAnalysis(updatedAnalysis)
      setRoadmap(updatedRoadmap)
      saveDashboardStore({ analysis: updatedAnalysis, roadmap: updatedRoadmap })

      const newMatchScore = updatedAnalysis.match_score
      const newTimeWeeks = updatedAnalysis.time_to_productivity_weeks
      const deltaMatchPercent = newMatchScore - prevMatchScore
      const deltaTimeWeeks = newTimeWeeks - prevTimeWeeks

      return {
        prevMatchScore,
        prevTimeWeeks,
        deltaMatchPercent,
        newMatchScore,
        deltaTimeWeeks,
        newTimeWeeks,
        newDecision: updatedAnalysis.decision,
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
      return null
    } finally {
      setBusy(false)
    }
  }

  async function handleAsk(message: string) {
    if (!analysis) return 'Upload resume + JD to generate a match score first.'
    const res = await chat(message, analysis)
    return res.reply
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">AI Adaptive Hiring & Onboarding Engine</div>
            <div className="mt-2 text-sm text-gray-600">Decision-ready hiring insights</div>
          </div>
          <div className="flex items-center gap-3">
            {busy ? <div className="text-sm text-gray-500">Processing...</div> : null}
            <button
              type="button"
              onClick={() => {
                clearDashboardStore()
                navigate('/upload')
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              New Assessment
            </button>
          </div>
        </div>

        {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

        {hydrating ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
            Loading analysis...
          </div>
        ) : dashboardReady && analysis && roadmap ? (
          <div className="space-y-6">
            <motion.div
              key={`summary-${analysis.match_score}-${analysis.decision}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <DashboardSummary analysis={analysis} />
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <motion.div
                  key={`skills-${analysis.match_score}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <SkillOverviewCompact analysis={analysis} />
                </motion.div>

                <motion.div
                  key={`gaps-${analysis.missing_skills.join(',')}-${analysis.weak_skills.join(',')}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <GapsAndInsightsPanel analysis={analysis} />
                </motion.div>
              </div>

              <div className="space-y-6 lg:col-span-5">
                <motion.div
                  key={`decision-${analysis.decision}-${analysis.confidence_level}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <DecisionIntelligencePanel analysis={analysis} />
                </motion.div>

                <div className="lg:sticky lg:top-6">
                  <ProductivityCard analysis={analysis} />
                </div>

                <WhatIfSimulationPanel analysis={analysis} onSimulate={handleSimulate} />
              </div>
            </div>

            <RoadmapSection roadmap={roadmap} />
          </div>
        ) : null}
      </div>

      <ChatWidget disabled={!dashboardReady} onAsk={handleAsk} />
    </div>
  )
}

