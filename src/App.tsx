import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load components for better performance
const CheckinForm = lazy(() => import('./pages/CheckinForm'))
const Checklist = lazy(() => import('./pages/Checklist'))
const PrintTags = lazy(() => import('./pages/PrintTags'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Check if we're in demo mode
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

function App() {
  return (
    <Layout>
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
          🚀 Demo Mode - No database connection. Data will be simulated.
        </div>
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<CheckinForm />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/print" element={<PrintTags />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App 