import { createBrowserRouter, Outlet } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DatabasePage } from './pages/DatabasePage'
import { MyStashPage } from './pages/MyStashPage'
import { PlannerPage } from './pages/PlannerPage'
import { LoadoutsPage } from './pages/LoadoutsPage'
import { ItemLookupPage } from './pages/ItemLookupPage'
import { TriagePage } from './pages/TriagePage'
import { MetaDashboardPage } from './pages/MetaDashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import { Navbar } from './components/Navbar'

// Main layout wrapper that includes the Auth provider and Navbar
const AppLayout = () => (
  <AuthProvider>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </AuthProvider>
)

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <DatabasePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/database',
        element: <DatabasePage />,
      },
      {
        path: '/my-stash',
        element: (
          <ProtectedRoute>
            <MyStashPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/planner',
        element: (
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/loadouts',
        element: <LoadoutsPage />,
      },
      {
        path: '/lookup',
        element: <ItemLookupPage />,
      },
      {
        path: '/triage',
        element: (
          <ProtectedRoute>
            <TriagePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/meta',
        element: <MetaDashboardPage />,
      },
    ],
  },
])
