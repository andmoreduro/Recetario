import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.js'
import { loginSchema } from '../schemas/schema'
import api from '../../../utils/api'
import toast from 'react-hot-toast'

export function useLogin() {
  const [data, setData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const nav = useNavigate()
  const { login } = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors = {}
      for (const error of result.error.errors) {
        fieldErrors[error.path[0]] = error.message
      }
      setErrors(fieldErrors)
      return
    }

    try {
      const response = await api.post('/login', result.data)
      login(response.data)
      toast.success('¡Bienvenido de nuevo!')
      nav('/home')
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message })
      } else {
        setErrors({ api: 'Ocurrió un error. Inténtalo de nuevo.' })
      }
    }
  }

  return { data, errors, handleChange, handleSubmit }
}