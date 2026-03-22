import React from 'react'

import Card from '../ui/Card'
import { AnalysisResult } from '../../types'

export default function ProductivityCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card title="Time to productivity" subtitle="Estimated onboarding time based on overall readiness.">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estimated ramp</div>
            <div className="mt-1 text-4xl font-extrabold tabular-nums text-gray-900">{analysis.time_to_productivity_weeks}</div>
            <div className="mt-1 text-sm text-gray-600">week(s)</div>
          </div>
          <div className="text-right text-sm text-gray-600">
            Based on your weighted match score.
          </div>
        </div>
      </div>
    </Card>
  )
}

