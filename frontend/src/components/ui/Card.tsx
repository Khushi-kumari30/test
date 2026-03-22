import React from 'react'

export default function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white shadow-md ${className}`}>
      <header className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
          </div>
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

