import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './components/layout/LandingPage'
import { Dashboard } from './components/layout/Dashboard'
import { Header } from './components/layout/Header'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="bg-background-dark text-[#EAEAEA]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden p-4 sm:p-6 md:p-8">
              <Header />
              <Dashboard />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App