import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/stores/auth.js'

/**
 * A component that acts as the application's entry point (`/`).
 * It checks the user's authentication status and redirects them
 * to the appropriate page.
 * - Logged-in users are sent to `/home`.
 * - Logged-out users are sent to `/login`.
 */
export default function Root() {
  const { profile } = useAuthStore.getState()

  if (profile) {
    return <Navigate to="/home" replace />
  }

  return <Navigate to="/login" replace />
}