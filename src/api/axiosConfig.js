import axios from 'axios'

// Cliente HTTP único hacia el back (Spring Boot). La URL base sale de .env (VITE_API_URL);
// si no está definida usa el back local. El JWT lo guarda authService en localStorage("token").
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
})

// Aviso global de "la sesión venció": AuthContext lo escucha y cierra la sesión
export const EVENTO_SESION_EXPIRADA = 'entrelibros:sesion-expirada'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Un 401 en cualquier endpoint que NO sea /auth/* con un token guardado = el token venció o ya no sirve.
// En /auth/* (login, confirmar…) un 401 es un resultado normal y lo maneja cada formulario con normalizarError().
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = (error.config && error.config.url) || ''
    if (error.response && error.response.status === 401 && !/\/auth\//.test(url) && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }
    return Promise.reject(error)
  },
)

export default api
