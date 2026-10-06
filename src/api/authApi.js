import api, { RUTA_AUTH, borrarTokens, guardarTokens } from './axiosConfig'
import { aUsuarioFront } from '../utils/adaptadores'

// AuthenticationController (/api/v1/auth). Login por E-MAIL (el back no acepta nombre de usuario).
const CLAVE_USUARIO = 'entrelibros_usuario_api'

const guardarUsuario = (u) => { try { localStorage.setItem(CLAVE_USUARIO, JSON.stringify(u)) } catch { /* sin espacio: se vuelve a pedir al back */ } }

// Sesión guardada de un visito anterior (hay token y usuario)
export const getSesionApi = () => {
  try {
    const crudo = localStorage.getItem(CLAVE_USUARIO)
    return crudo && localStorage.getItem('token') ? JSON.parse(crudo) : null
  } catch { return null }
}

export const cerrarSesionApi = () => {
  borrarTokens()
  try { localStorage.removeItem(CLAVE_USUARIO) } catch { /* nada que borrar */ }
}

// GET /usuarios/{id}: el login solo devuelve { usuarioId, nombreUsuario, rol }; nombre, apellido, email y tienda salen de acá
export const traerUsuarioApi = async (id) => {
  const u = aUsuarioFront((await api.get(`/usuarios/${id}`)).data)
  guardarUsuario(u)
  return u
}

const abrirSesion = async (datos) => {
  guardarTokens(datos)
  try {
    return await traerUsuarioApi(datos.usuarioId)
  } catch (err) {
    cerrarSesionApi()
    throw err
  }
}

export const loginApi = async (email, contrasena) =>
  abrirSesion((await api.post(`${RUTA_AUTH}/login`, { email: email.trim(), contrasena })).data)

// Body de UsuarioRequest. La cuenta nace sin verificar: el back manda el código por mail (201 { mensaje }).
export const registrarApi = async (v) => {
  const body = {
    nombreUsuario: v.nombreUsuario.trim(), email: v.email.trim(), contrasena: v.pw, nombre: v.nombre.trim(), apellido: v.apellido.trim(),
  }
  await api.post(`${RUTA_AUTH}/register`, body)
  return { email: body.email, nombre: body.nombre, nombreUsuario: body.nombreUsuario }
}

// Devuelve los tokens: la cuenta queda con sesión iniciada
export const verificarEmailApi = async (email, codigo) =>
  abrirSesion((await api.post(`${RUTA_AUTH}/verificar-email`, { email, codigo: codigo.trim() })).data)

export const reenviarCodigoApi = async (email) => (await api.post(`${RUTA_AUTH}/reenviar-codigo-verificacion`, { email })).data

export const recuperarContraseniaApi = async (email) => (await api.post(`${RUTA_AUTH}/recuperar-contrasenia`, { email })).data

export const cambiarContraseniaApi = async ({ email, codigo, nuevaContrasenia }) =>
  (await api.post(`${RUTA_AUTH}/cambiar-contrasenia`, { email, codigo, nuevaContrasenia })).data
