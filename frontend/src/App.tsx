import React from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import mock from './mock/mockData'
import { clearDashboardStore, saveDashboardStore } from './utils/dashboardStorage'

function AppRoutes() {
  const navigate = useNavigate()

  function handleUseMock() {
    clearDashboardStore()
    saveDashboardStore({ analysis: mock.mockAnalysis, roadmap: mock.mockRoadmap })
    navigate('/dashboard')
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onUseMock={handleUseMock} />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

