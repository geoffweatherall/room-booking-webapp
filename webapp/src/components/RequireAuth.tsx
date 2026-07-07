import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/authContext'

/**
 * Route guard: renders its child routes only for signed-in users, otherwise
 * redirects to the sign-in page (remembering where the user was heading).
 */
export function RequireAuth() {
  const { email, initialising } = useAuth()
  const location = useLocation()

  if (initialising) {
    return null
  }
  if (!email) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
}
