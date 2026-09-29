// import api from '../api/axiosConfig'
import { guardar, leer } from './almacen'

// Cuentas de ejemplo guardadas SOLO en este navegador (misma forma que el prototipo HTML).
// Cuando esté el back: login -> endpoint de login, register -> POST /api/v1/auth/register,
// y el JWT que devuelvan se guarda en localStorage("token"), que es lo que lee axiosConfig.
const CLAVE_USUARIOS = 'entrelibros_users'
const CLAVE_SESION = 'entrelibros_session'

const cuenta = (nombreUsuario, nombre, apellido, rol) => ({
  nombreUsuario, email: `${nombreUsuario}@mail.com`, contrasena: 'Clave123!',
  nombre, apellido, verificado: true, rol, estado: 'ACTIVO',
})

const SEMILLA = [
  cuenta('usuario_prueba', 'Usuario', 'Prueba', 'COMPRADOR'),
  cuenta('vendedor_prueba', 'Librería', 'El Aleph', 'VENDEDOR'),
  cuenta('admin_prueba', 'Admin', 'Prueba', 'ADMIN'),
]

export const getUsuarios = () => {
  const guardados = leer(CLAVE_USUARIOS, null)
  if (guardados) return guardados
  guardar(CLAVE_USUARIOS, SEMILLA)
  return SEMILLA
}

export const getSesion = () => {
  const nombre = leer(CLAVE_SESION, null)
  const u = nombre && getUsuarios().find((x) => x.nombreUsuario === nombre)
  return u && u.estado !== 'DADO_DE_BAJA' ? u : null
}

// Devuelve { user } o { error }
export const iniciarSesion = (ident, contrasena) => {
  const i = ident.trim().toLowerCase()
  const u = getUsuarios().find((x) => x.nombreUsuario.toLowerCase() === i || x.email.toLowerCase() === i)
  if (!u || u.contrasena !== contrasena) return { error: 'Usuario o contraseña incorrectos.' }
  if (u.estado === 'DADO_DE_BAJA') return { error: 'Tu cuenta fue dada de baja. Contactá a un administrador.' }
  guardar(CLAVE_SESION, u.nombreUsuario)
  return { user: u }
}

// TODO: el prototipo confirma la cuenta con un código por mail; acá entra directo.
export const registrar = (v) => {
  const usuarios = getUsuarios()
  const nuevo = {
    nombreUsuario: v.nombreUsuario, email: v.email.trim(), contrasena: v.pw,
    nombre: v.nombre.trim(), apellido: v.apellido.trim(),
    verificado: true, rol: 'COMPRADOR', estado: 'ACTIVO',
  }
  guardar(CLAVE_USUARIOS, [...usuarios, nuevo])
  guardar(CLAVE_SESION, nuevo.nombreUsuario)
  return nuevo
}

export const cerrarSesion = () => guardar(CLAVE_SESION, null)
