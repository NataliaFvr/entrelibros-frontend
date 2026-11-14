import axios from 'axios'
import { normalizarError } from '../utils/errorApi'

// Cliente HTTP único hacia el back (Spring Boot).
// está en la raíz (/libros, /carrito, /ordenes…). Por eso baseURL es la RAÍZ del servidor (VITE_API_URL sin el
// sufijo /api/v1) y las rutas de auth se arman con RUTA_AUTH.
export const RAIZ = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
export const RUTA_AUTH = '/api/v1/auth'

// Aviso global de "la sesión venció": App.jsx lo escucha y cierra la sesión
// Quien quiera enterarse de que la sesión venció se anota acá (App.jsx); devuelve cómo darse de baja
const alVencerSesion = new Set()
export const escucharSesionVencida = (fn) => { alVencerSesion.add(fn); return () => alVencerSesion.delete(fn) }

const CLAVE_TOKEN = 'token'
const CLAVE_REFRESH = 'refresh_token'

// El back responde { access_token, refresh_token, usuarioId, nombreUsuario, rol } (AuthenticationResponse)
export const guardarTokens = (datos) => {
  if (datos.access_token) localStorage.setItem(CLAVE_TOKEN, datos.access_token)
  if (datos.refresh_token) localStorage.setItem(CLAVE_REFRESH, datos.refresh_token)
}
export const borrarTokens = () => {
  localStorage.removeItem(CLAVE_TOKEN)
  localStorage.removeItem(CLAVE_REFRESH)
}

const api = axios.create({
  baseURL: RAIZ,
  timeout: 15000,
  // Spring lee las listas como idCategorias=1&idCategorias=2 (axios por defecto manda idCategorias[]=1)
  paramsSerializer: { indexes: null },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Un solo refresh a la vez, aunque fallen varias llamadas juntas
let refrescando = null
const refrescar = () => {
  const refresh = localStorage.getItem(CLAVE_REFRESH)
  if (!refresh) return Promise.reject(new Error('Sin refresh token'))
  if (!refrescando) {
    refrescando = axios
      .post(`${RAIZ}${RUTA_AUTH}/refresh`, { refresh_token: refresh }, { timeout: 15000 })
      .then(({ data }) => { guardarTokens(data); return data.access_token })
      .finally(() => { refrescando = null })
  }
  return refrescando
}

const vencer = () => {
  borrarTokens()
  alVencerSesion.forEach((fn) => fn())
}

// El mismo código HTTP significa cosas distintas según la pantalla (un 401 en el login son credenciales incorrectas)
const contextoDe = (config) => {
  const url = config.url || ''
  if (url.endsWith('/auth/login')) return 'login'
  if (url.endsWith('/auth/register')) return 'registro'
  if (/\/auth\/(verificar-email|reenviar-codigo|recuperar-contrasenia|cambiar-contrasenia)/.test(url)) return 'verificacion'
  if (url.startsWith('/usuarios') && config.method !== 'get') return 'registro' // 409 = usuario o e-mail repetido
  return ''
}

// Un 401 en cualquier endpoint que NO sea /auth/* con un token guardado = el token venció: se intenta renovarlo con el
// refresh token y se repite la llamada una vez; si tampoco sirve, se cierra la sesión.
// En /auth/* (login, verificar…) un 401 es un resultado normal y lo maneja cada formulario con normalizarError().
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const config = error.config || {}
    const url = config.url || ''
    const esAuth = /\/auth\//.test(url)
    if (error.response && error.response.status === 401 && !esAuth && localStorage.getItem(CLAVE_TOKEN)) {
      if (!config._reintento) {
        try {
          const nuevo = await refrescar()
          config._reintento = true
          config.headers.Authorization = `Bearer ${nuevo}`
          return api(config)
        } catch {
          vencer()
        }
      } else {
        vencer()
      }
    }
    // El error sigue su camino con el mensaje claro para la persona (y el detalle en `info`): así las acciones de Redux
    // no necesitan try/catch y el slice muestra action.error.message tal cual.
    const info = normalizarError(error, contextoDe(config))
    error.message = info.mensaje
    error.info = info
    return Promise.reject(error)
  },
)

export default api
