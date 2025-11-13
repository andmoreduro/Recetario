import axios from 'axios'
import { useAuthStore } from '../modules/auth/stores/auth.js'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const { profile } = useAuthStore.getState()
  if (profile && profile.id) {
    config.headers['X-User-ID'] = profile.id
  }
  return config
})

export default api