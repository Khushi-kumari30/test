import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'


const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

export default function LandingPage({ onUseMock }) {
  const navigate = useNavigate()

  const featureCards = useMemo(
    () => [
      {
        icon: '🧠',
        title: 'Skill Gap Analysis',
        desc: 'Compute weighted match scores from resume evidence vs. job requirements, with explainable strengths and gaps.',
      },
      {
        icon: '🗺️',
        title: 'Personalized Learning Path',
        desc: 'Generate a clear 4-week onboarding roadmap mapped to missing and weak skills.',
      },
      {
        icon: '⚡',
        title: 'What-If Simulation',
        desc: 'Simulate closing a gap at a chosen level to see score, decision, and time-to-productivity impact.',
      },
    ],
    [],
  )


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50 to-white"
    >
      {/* Floating blobs (subtle, premium background) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl"
        animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* HERO */}
        <section className="relative">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <motion.h1
                {...fadeUp}
                transition={{ delay: 0.05, duration: 0.5, ease: 'easeOut' }}
                className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
              >
                AI-Powered Hiring &amp; Onboarding Engine
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
                className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-gray-600 sm:text-lg"
              >
                Analyze candidates, identify skill gaps, and simulate hiring decisions instantly.
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 hover:scale-[1.02]"
                >
                  Upload Resume (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="rounded-lg border border-gray-200 bg-white/70 px-5 py-2.5 text-sm font-extrabold text-gray-900 shadow-sm transition hover:bg-white hover:scale-[1.02]"
                >
                  Upload Job Description (PDF)
                </button>
              </motion.div>
            </div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.22, duration: 0.55, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200">
                <div className="text-sm font-semibold text-gray-900">Instant, explainable decisions</div>
                <div className="mt-1 text-2xl font-extrabold text-gray-900">Match score + roadmap</div>
                <div className="mt-3 text-sm text-gray-600">Upload PDFs on the next page to compute skill gaps, training needs, and what-if impact.</div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs font-bold text-gray-900">Explainable</div>
                    <div className="mt-1 text-xs text-gray-600">Evidence-based</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs font-bold text-gray-900">Actionable</div>
                    <div className="mt-1 text-xs text-gray-600">4-week plan</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs font-bold text-gray-900">Fast</div>
                    <div className="mt-1 text-xs text-gray-600">Minutes</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onUseMock}
                  className="mt-5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-extrabold text-gray-900 shadow-sm hover:bg-gray-50 transition"
                >
                  Try Mock Data
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Features</h2>
              <p className="mt-1 text-sm text-slate-600">Built for hiring managers who want speed and clarity.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {featureCards.map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">{c.icon}</div>
                  <div className="text-base font-extrabold text-slate-900">{c.title}</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-slate-900">How it works</h2>
          <p className="mt-1 text-sm text-slate-600">From PDFs to decisions, in minutes.</p>

          <div className="mt-6 hidden md:grid md:grid-cols-3 md:gap-4">
            {[
              { n: '1', title: 'Upload Resume & JD', desc: 'PDF resume + PDF job description.' , icon: '📄' },
              { n: '2', title: 'AI analyzes skills', desc: 'Match score, gaps, and weak areas.' , icon: '🧠' },
              { n: '3', title: 'Dashboard + What-If', desc: 'Simulate hiring impact and roadmap.' , icon: '⚡' },
            ].map((s) => (
              <motion.div
                key={s.n}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">{s.icon}</div>
                  <div>
                    <div className="text-xs font-extrabold text-indigo-700">Step {s.n}</div>
                    <div className="text-base font-extrabold text-slate-900">{s.title}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
            {[
              { n: '1', title: 'Upload Resume & JD', desc: 'PDF resume + PDF job description.' , icon: '📄' },
              { n: '2', title: 'AI analyzes skills', desc: 'Match score, gaps, and weak areas.' , icon: '🧠' },
              { n: '3', title: 'Dashboard + What-If', desc: 'Simulate hiring impact and roadmap.' , icon: '⚡' },
            ].map((s) => (
              <motion.div
                key={s.n}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">{s.icon}</div>
                  <div>
                    <div className="text-xs font-extrabold text-indigo-700">Step {s.n}</div>
                    <div className="text-base font-extrabold text-slate-900">{s.title}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="mt-14 pb-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-white/70 px-6 py-5 text-slate-900 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-blue-700">Ready when you are</div>
              <div className="mt-1 text-2xl font-extrabold">Start Analysis</div>
              <div className="mt-2 text-sm text-slate-600">Upload your resume + JD as PDFs to generate your match score and onboarding roadmap.</div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/10 transition hover:scale-[1.02]"
            >
              Start Analysis
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

