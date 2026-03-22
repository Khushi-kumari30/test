import { AnalysisResult, RoadmapResponse } from '../types'

const KEY = 'aiAdaptiveHiringDashboard_v1'

export type DashboardStore = {
  analysis: AnalysisResult
  roadmap: RoadmapResponse
}

export function saveDashboardStore(store: DashboardStore) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function loadDashboardStore(): DashboardStore | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as DashboardStore
  } catch {
    return null
  }
}

export function clearDashboardStore() {
  localStorage.removeItem(KEY)
}

