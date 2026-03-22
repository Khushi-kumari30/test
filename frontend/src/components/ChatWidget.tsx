import React, { useEffect, useRef, useState } from 'react'

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

export default function ChatWidget({
  onAsk,
  disabled,
}: {
  onAsk: (message: string) => Promise<string>
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi! I can help you evaluate this candidate.' },
  ])
  const [input, setInput] = useState('')
  const [working, setWorking] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  const quickActions = [
    'Should I hire this candidate?',
    'What skills are missing?',
    'How long to make them job-ready?',
    'What should we train first?',
  ]

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, working, open])

  async function send(message: string) {
    const trimmed = message.trim()
    if (!trimmed || disabled || working) return

    const safeId = () =>
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random())

    setMessages((prev) => [...prev, { id: safeId(), role: 'user', text: trimmed }])
    setInput('')
    setWorking(true)
    try {
      const replyText = await onAsk(trimmed)
      setMessages((prev) => [...prev, { id: safeId(), role: 'assistant', text: replyText }])
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Icon button (always visible, does not block dashboard) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label="Open AI Assistant chat"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
      >
        <span className="text-xl">💬</span>
      </button>

      {/* Chat window (overlay above the icon; animated entry) */}
      <div
        className={[
          'absolute right-0 bottom-14 w-[320px] h-[400px] overflow-hidden rounded-2xl border shadow-lg',
          'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80',
          'border-slate-200',
          'transition-all duration-200 ease-out',
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">AI Assistant</div>
            <div className="text-xs text-slate-600">Answering using your current match analysis</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
          >
            <span className="text-base">✕</span>
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  'rounded-xl border px-3 py-2 text-sm whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'border-indigo-100 bg-indigo-50 text-slate-900'
                    : 'border-slate-100 bg-white text-slate-800',
                ].join(' ')}
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={disabled || working}
                onClick={() => send(q)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60 transition"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={input}
              disabled={disabled || working}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input)
              }}
              placeholder="Ask about hiring, missing skills, or training time..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition"
            />
            <button
              type="button"
              disabled={disabled || working}
              onClick={() => send(input)}
              className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 transition"
            >
              {working ? '…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

