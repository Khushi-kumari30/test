import React from 'react'

function colorForPercent(percent: number) {
  if (percent >= 75) return 'bg-emerald-500'
  if (percent >= 45) return 'bg-amber-500'
  return 'bg-rose-500'
}

export default function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  return (
    <div className="w-full">
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-800">{label}</span>
          <span className="text-sm font-semibold tabular-nums text-slate-700">{percent}%</span>
        </div>
      ) : null}
      <div className="h-3 w-full rounded-full bg-slate-100">
        <div className={`h-3 rounded-full ${colorForPercent(percent)}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

