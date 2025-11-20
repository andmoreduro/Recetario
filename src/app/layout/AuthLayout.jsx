import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../modules/auth/stores/auth.js'

export default function AuthLayout() {
  const { profile } = useAuthStore()

  if (!profile) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}