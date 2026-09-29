import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/useAuth'
import { HouseholdProvider, useHousehold } from '@/lib/useHousehold'
import { ThemeProvider } from '@/lib/useTheme'
import { Login } from '@/pages/Login'
import { Onboarding } from '@/pages/Onboarding'
import { Dashboard } from '@/pages/Dashboard'
import { Tasks } from '@/pages/Tasks'
import { Todos } from '@/pages/Todos'
import { HouseholdPage } from '@/pages/Household'
import { Layout } from '@/components/Layout'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-3xl animate-pulse">🌿</div>
    </div>
  )
}

function AuthedApp() {
  const { household, loading } = useHousehold()

  if (loading) return <LoadingScreen />
  if (!household) return <Onboarding />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/household" element={<HouseholdPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  const { session, loading } = useAuth()

  return (
    <ThemeProvider>
      {loading ? (
        <LoadingScreen />
      ) : !session ? (
        <Login />
      ) : (
        <HouseholdProvider>
          <AuthedApp />
        </HouseholdProvider>
      )}
    </ThemeProvider>
  )
}
