import axios from 'axios'

// Cliente HTTP único hacia el back (Spring Boot). La URL base sale de .env (VITE_API_URL);
// si no está definida usa el back local. El JWT lo guarda authService en localStorage("token").
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
