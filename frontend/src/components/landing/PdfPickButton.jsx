import React, { useId, useMemo } from 'react'

export default function PdfPickButton({
  label,
  fileName,
  onPick,
  disabled,
  icon = '⬆️',
}) {
  const inputId = useId()
  const accepted = useMemo(() => 'application/pdf,.pdf', [])

  return (
    <div className="space-y-2">
      <input
        id={inputId}
        type="file"
        accept={accepted}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f)
        }}
      />

      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 backdrop-blur transition hover:bg-white/15 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg">{icon}</span>
        {label}
      </label>

      {fileName ? <div className="text-xs text-white/80">{fileName}</div> : null}
    </div>
  )
}

