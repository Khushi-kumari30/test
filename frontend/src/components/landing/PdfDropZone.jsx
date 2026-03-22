import React, { useId, useMemo, useState } from 'react'

export default function PdfDropZone({
  onFiles,
  disabled,
  hint = 'Drag & drop Resume or JD (PDF) or click to upload',
}) {
  const id = useId()
  const [dragOver, setDragOver] = useState(false)

  const accepted = useMemo(() => 'application/pdf,.pdf', [])

  function handleFiles(fileList) {
    const files = Array.from(fileList || [])
    const pdfs = files.filter((f) => (f?.type || '').includes('pdf') || f.name.toLowerCase().endsWith('.pdf'))
    if (!pdfs.length) return
    onFiles(pdfs)
  }

  return (
    <div className="space-y-3">
      <input
        id={id}
        type="file"
        multiple
        accept={accepted}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <label
        htmlFor={id}
        onDragOver={(e) => {
          if (disabled) return
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (disabled) return
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer?.files)
        }}
        className={[
          'cursor-pointer select-none rounded-2xl border-2 border-dashed p-6 text-center transition',
          disabled ? 'cursor-not-allowed opacity-60' : '',
          dragOver ? 'border-purple-400 bg-purple-50/60' : 'border-slate-300 bg-white/10 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-2">
          <div className="text-2xl">📄</div>
          <div className="text-sm font-semibold text-slate-700">{hint}</div>
          <div className="text-xs text-slate-500">PDF only</div>
        </div>
      </label>
    </div>
  )
}

