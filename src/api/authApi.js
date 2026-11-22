import api, { RUTA_AUTH, borrarTokens, guardarTokens } from './axiosConfig'
import { aUsuarioFront } from './adaptadores'

// AuthenticationController (/api/v1/auth). Login por E-MAIL (el back no acepta nombre de usuario).
// El usuario se persiste mediante redux-persist; esta clave solo se elimina por
// compatibilidad con instalaciones que usaban el mecanismo anterior.
const CLAVE_USUARIO_ANTERIOR = 'entrelibros_usuario_api'

export const cerrarSesionApi = () => {
  borrarTokens()
  try { localStorage.removeItem(CLAVE_USUARIO_ANTERIOR) } catch { /* nada que borrar */ }
}

// GET /usuarios/{id}: el login solo devuelve { usuarioId, nombreUsuario, rol }; nombre, apellido, email y tienda salen de acá
export const traerUsuarioApi = async (id) => {
  return aUsuarioFront((await api.get(`/usuarios/${id}`)).data)
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
    nombreUsuario: v.nombreUsuario.trim(), email: v.email.trim(), contrasena: v.contrasena, nombre: v.nombre.trim(), apellido: v.apellido.trim(),
    repetirContrasena: v.repetirContrasena,
  }
  await api.post(`${RUTA_AUTH}/register`, body)
  return { email: body.email, nombre: body.nombre, nombreUsuario: body.nombreUsuario }
}

// Devuelve los tokens: la cuenta queda con sesión iniciada
export const verificarEmailApi = async (email, codigo) =>
  abrirSesion((await api.post(`${RUTA_AUTH}/verificar-email`, { email, codigo: codigo.trim() })).data)

export const reenviarCodigoApi = async (email) => (await api.post(`${RUTA_AUTH}/reenviar-codigo-verificacion`, { email })).data

export const recuperarContraseniaApi = async (email) => (await api.post(`${RUTA_AUTH}/recuperar-contrasenia`, { email })).data

export const cambiarContraseniaApi = async ({ email, codigo, nuevaContrasenia, repetirNuevaContrasenia }) =>
  (await api.post(`${RUTA_AUTH}/cambiar-contrasenia`, { email, codigo, nuevaContrasenia, repetirNuevaContrasenia })).data
