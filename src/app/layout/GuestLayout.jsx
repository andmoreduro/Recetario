import { Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../../modules/auth/stores/auth.js'

export default function GuestLayout() {
  const { profile } = useAuthStore()

  if (profile) {
    return <Navigate to="/home" />
  }

  return (
    <>
      <Toaster position="top-center" />
      <Outlet />
    </>
  )
}