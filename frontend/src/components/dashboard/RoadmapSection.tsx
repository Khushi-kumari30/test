import React from 'react'
import Card from '../ui/Card'
import { RoadmapResponse } from '../../types'

export default function RoadmapSection({ roadmap }: { roadmap: RoadmapResponse }) {
  return (
    <Card title="Learning roadmap" subtitle="A 4-week plan to close the biggest gaps and get to job-ready.">
      <div className="space-y-4">
        {roadmap.weeks.map((w, idx) => (
          <div key={w.week_number} className="flex items-start gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white shadow-sm">
              {w.week_number}
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-gray-900">{w.title}</div>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {w.tasks.slice(0, 3).map((t, tIdx) => (
                  <li key={tIdx} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              {idx === roadmap.weeks.length - 1 ? null : <div className="mt-4 h-px bg-gray-100" />}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

