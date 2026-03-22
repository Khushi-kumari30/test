import React from 'react'

import Card from '../ui/Card'
import { AnalysisResult } from '../../types'

function pill(decision: AnalysisResult['decision']) {
  if (decision === 'Recommended for Hiring') return 'border-emerald-200 bg-emerald-50 text-emerald-900'
  if (decision === 'Needs Training') return 'border-blue-200 bg-blue-50 text-blue-900'
  return 'border-rose-200 bg-rose-50 text-rose-900'
}

export default function DecisionIntelligencePanel({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card title="Hiring decision" subtitle="Confidence, risk, and the one-line takeaway.">
      <div className="rounded-xl bg-white">
        <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${pill(analysis.decision)}`}>
          {analysis.decision}
        </div>

        <div className="mt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Confidence</div>
          <div className="mt-1 text-lg font-extrabold text-gray-900">{analysis.confidence_level}</div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Risk indicator</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">{analysis.risk_indicator}</div>
          <div className="mt-2 text-sm text-gray-600">{analysis.one_line_insight}</div>
        </div>
      </div>
    </Card>
  )
}

