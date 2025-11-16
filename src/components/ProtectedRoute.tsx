import { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * A wrapper component that protects routes requiring authentication.
 *
 * 1. If auth state is still loading, it shows a "Loading..." message.
 * 2. If auth is loaded and no user exists, it redirects to "/login".
 * 3. If auth is loaded and a user exists, it renders the child component.
 */
export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading session...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
