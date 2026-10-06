import axios from 'axios'

// Cliente HTTP único hacia el back (Spring Boot).
// OJO con la URL: en el back solo /auth cuelga de /api/v1 (AuthenticationController); el resto de los controllers
// está en la raíz (/libros, /carrito, /ordenes…). Por eso baseURL es la RAÍZ del servidor (VITE_API_URL sin el
// sufijo /api/v1) y las rutas de auth se arman con RUTA_AUTH.
export const RAIZ = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
export const RUTA_AUTH = '/api/v1/auth'

// Aviso global de "la sesión venció": AuthContext lo escucha y cierra la sesión
export const EVENTO_SESION_EXPIRADA = 'entrelibros:sesion-expirada'

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
  window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
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
    return Promise.reject(error)
  },
)

export default api
