import React from 'react'

import { AnalysisResult } from '../../types'

function Chip({ children, tone }: { children: React.ReactNode; tone: 'missing' | 'weak' }) {
  const cls = tone === 'missing' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>
}

export default function GapsAndInsightsPanel({ analysis }: { analysis: AnalysisResult }) {
  const missing = analysis.missing_skills
  const weak = analysis.weak_skills

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Skill gaps</div>
          <h3 className="mt-1 text-lg font-extrabold text-gray-900">Missing & weak signals</h3>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-gray-900">Missing</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {missing.length ? missing.map((s) => <Chip key={s} tone="missing">{s}</Chip>) : <span className="text-sm text-gray-500">None detected</span>}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">Weak</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {weak.length ? weak.map((s) => <Chip key={s} tone="weak">{s}</Chip>) : <span className="text-sm text-gray-500">None detected</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <span className="font-semibold text-gray-900">Insight:</span> {analysis.one_line_insight}
      </div>
    </section>
  )
}

