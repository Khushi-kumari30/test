import React from 'react'
import { motion } from 'framer-motion'

import { AnalysisResult } from '../../types'
import { decisionTone } from '../../utils/humanize'

export default function DashboardSummary({
  analysis,
}: {
  analysis: AnalysisResult
}) {
  const scoreColor =
    analysis.match_score > 80 ? 'text-emerald-700' : analysis.match_score >= 60 ? 'text-blue-700' : 'text-rose-700'

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Candidate</div>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">{analysis.candidate_name}</h2>
          <div className="mt-1 text-sm text-gray-600">
            {analysis.role} • {analysis.experience_level}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Match score</div>
          <motion.div
            key={analysis.match_score}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`mt-1 text-5xl font-extrabold tabular-nums ${scoreColor}`}
          >
            {analysis.match_score}%
          </motion.div>
          <div className="mt-2">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${decisionTone(analysis.decision).pill}`}>
              {decisionTone(analysis.decision).label}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

