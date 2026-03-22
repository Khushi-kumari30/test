import React, { useMemo } from 'react'

import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import StatusBadge from '../ui/StatusBadge'
import { AnalysisResult } from '../../types'

export default function SkillOverviewCompact({ analysis }: { analysis: AnalysisResult }) {
  const skills = useMemo(() => {
    return [...analysis.skill_evaluations]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 6)
  }, [analysis.skill_evaluations])

  return (
    <Card title="Skill overview" subtitle="Top weighted requirements from your job description.">
      <div className="space-y-4">
        {skills.map((se) => (
          <div key={se.skill} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">{se.skill}</div>
                <div className="mt-1 text-xs text-gray-600">
                  Target {se.expected_level}/100 • Evidence {se.resume_level}/100
                </div>
              </div>
              <StatusBadge status={se.status} />
            </div>
            <div className="mt-3">
              <ProgressBar percent={se.match_percent} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

