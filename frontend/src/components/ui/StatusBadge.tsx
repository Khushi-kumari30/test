import React from 'react'
import { SkillStatus } from '../../types'

export default function StatusBadge({ status }: { status: SkillStatus }) {
  const cfg =
    status === 'strong'
      ? { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' }
      : status === 'weak'
        ? { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' }
        : { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {status === 'strong' ? 'Strong' : status === 'weak' ? 'Weak' : 'Missing'}
    </span>
  )
}

