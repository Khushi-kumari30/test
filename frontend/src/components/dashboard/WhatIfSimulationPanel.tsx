import React, { useMemo, useState } from 'react'
import Card from '../ui/Card'
import { AnalysisResult, SkillLevel } from '../../types'

export default function WhatIfSimulationPanel({
  analysis,
  onSimulate,
}: {
  analysis: AnalysisResult
  onSimulate: (addedSkill: string, level: SkillLevel) => Promise<{
    prevMatchScore: number
    prevTimeWeeks: number
    deltaMatchPercent: number
    newMatchScore: number
    deltaTimeWeeks: number
    newTimeWeeks: number
    newDecision: AnalysisResult['decision']
  } | null>
}) {
  const missingOptions = analysis.missing_skills
  const [selectedSkill, setSelectedSkill] = useState<string>(missingOptions[0] || '')
  const [level, setLevel] = useState<SkillLevel>('Intermediate')
  const [working, setWorking] = useState(false)
  const [impact, setImpact] = useState<null | {
    prevMatchScore: number
    prevTimeWeeks: number
    deltaMatchPercent: number
    newMatchScore: number
    deltaTimeWeeks: number
    newTimeWeeks: number
    newDecision: AnalysisResult['decision']
  }>(null)

  const disabled = missingOptions.length === 0 || working
  const levelOptions: SkillLevel[] = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], [])

  async function handleSimulate() {
    if (!selectedSkill) return
    setWorking(true)
    setImpact(null)
    try {
      const res = await onSimulate(selectedSkill, level)
      if (res) setImpact(res)
    } finally {
      setWorking(false)
    }
  }

  return (
    <Card title="What-If simulation" subtitle="Simulate adding a missing skill at a chosen level.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Missing Skill</span>
          <select
            disabled={disabled}
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-300"
          >
            {missingOptions.length ? null : (
              <option value="">No missing skills</option>
            )}
            {missingOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Level</span>
          <select
            disabled={disabled}
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillLevel)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-300"
          >
            {levelOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col">
          <span className="mb-2 block text-sm font-medium text-slate-800">Action</span>
          <button
            type="button"
            disabled={disabled}
            onClick={handleSimulate}
            className="mt-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {working ? 'Simulating...' : 'Simulate Impact'}
          </button>
        </div>
      </div>

      {impact ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Simulation result</div>
              <div className="mt-1 text-sm font-extrabold text-gray-900">{impact.newDecision}</div>
              <div className="mt-1 text-sm text-gray-600">
                Match score: <span className="font-semibold">{impact.prevMatchScore}%</span> → <span className="font-semibold">{impact.newMatchScore}%</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Onboarding time: <span className="font-semibold">{impact.prevTimeWeeks}</span> → <span className="font-semibold">{impact.newTimeWeeks}</span>
              </div>
            </div>
            <div className={`rounded-xl border px-3 py-2 text-right ${impact.deltaMatchPercent > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              <div className="text-xs font-semibold text-gray-600">Improvement</div>
              <div className="mt-1 text-lg font-extrabold tabular-nums">
                {impact.deltaMatchPercent > 0 ? '+' : ''}
                {impact.deltaMatchPercent}%
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-gray-600">
                {impact.deltaMatchPercent >= 0 ? 'match-score lift' : 'match-score drop'}
              </div>
            </div>
          </div>
          {impact.deltaTimeWeeks < 0 ? (
            <div className="mt-3 text-xs font-semibold text-emerald-700">Reduced onboarding by {Math.abs(impact.deltaTimeWeeks)} week(s).</div>
          ) : impact.deltaTimeWeeks > 0 ? (
            <div className="mt-3 text-xs font-semibold text-amber-700">Onboarding increases by {impact.deltaTimeWeeks} week(s).</div>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}

