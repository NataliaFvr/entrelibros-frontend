// import api from '../api/axiosConfig'
import { guardar, leer } from './almacen'
import { CUENTA_VENDEDOR_DEMO } from '../data/cuentasDemo'

// Cuentas de ejemplo guardadas SOLO en este navegador (misma forma que el prototipo HTML).
// Cuando esté el back:
//   register        -> POST /api/v1/auth/register  (la cuenta queda PENDIENTE_CONFIRMACION)
//   confirmar       -> POST /api/v1/auth/confirmar {email, codigo}  (devuelve los tokens)
//   reenviar código -> POST /api/v1/auth/reenviar-codigo {email}
//   login sin confirmar -> 403 CUENTA_NO_CONFIRMADA
// El JWT se guarda en localStorage("token"), que es lo que lee axiosConfig.
const CLAVE_USUARIOS = 'entrelibros_users'
const CLAVE_SESION = 'entrelibros_session'
const VIDA_CODIGO = 15 * 60000
const MAX_INTENTOS = 5

const cuenta = (nombreUsuario, nombre, apellido, rol) => ({
  nombreUsuario, email: `${nombreUsuario}@mail.com`, contrasena: 'Clave123!',
  nombre, apellido, verificado: true, rol, estado: 'ACTIVO',
})

const SEMILLA = [
  cuenta('usuario_prueba', 'Usuario', 'Prueba', 'COMPRADOR'),
  cuenta('vendedor_prueba', 'Librería', 'El Aleph', 'VENDEDOR'),
  cuenta('admin_prueba', 'Admin', 'Prueba', 'ADMIN'),
  CUENTA_VENDEDOR_DEMO,
]

export const getUsuarios = () => {
  const guardados = leer(CLAVE_USUARIOS, null)
  if (!guardados) {
    guardar(CLAVE_USUARIOS, SEMILLA)
    return SEMILLA
  }
  // Un navegador que ya tenía usuarios guardados no recibiría las cuentas de ejemplo nuevas: se las sumamos
  const faltan = SEMILLA.filter((s) => !guardados.some((u) => u.nombreUsuario === s.nombreUsuario))
  if (!faltan.length) return guardados
  const lista = [...guardados, ...faltan]
  guardar(CLAVE_USUARIOS, lista)
  return lista
}

// Reemplaza la lista completa de cuentas (la usa el panel de administración). Devuelve false si no hay espacio.
export const guardarUsuarios = (lista) => guardar(CLAVE_USUARIOS, lista)

const buscar = (nombreUsuario) => getUsuarios().find((x) => x.nombreUsuario === nombreUsuario)

// Aplica cambios a un usuario y devuelve el usuario actualizado
const modificar = (nombreUsuario, cambios) => {
  const lista = getUsuarios().map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, ...cambios } : u))
  guardar(CLAVE_USUARIOS, lista)
  return lista.find((u) => u.nombreUsuario === (cambios.nombreUsuario || nombreUsuario))
}

export const getSesion = () => {
  const nombre = leer(CLAVE_SESION, null)
  const u = nombre && buscar(nombre)
  return u && u.estado !== 'DADO_DE_BAJA' && u.verificado !== false ? u : null
}

// Devuelve { user }, { pendiente } (falta confirmar el mail) o { error, tipo }. `tipo` es el mismo que arma errorApi.js con la API.
export const iniciarSesion = (ident, contrasena) => {
  const i = ident.trim().toLowerCase()
  const u = getUsuarios().find((x) => x.nombreUsuario.toLowerCase() === i || x.email.toLowerCase() === i)
  if (!u || u.contrasena !== contrasena) return { error: 'Usuario o contraseña incorrectos.', tipo: 'CREDENCIALES' }
  if (u.estado === 'DADO_DE_BAJA') return { error: 'Tu cuenta fue dada de baja. Contactá a un administrador.', tipo: 'PERMISO' }
  if (u.verificado === false) return { pendiente: u }
  guardar(CLAVE_SESION, u.nombreUsuario)
  return { user: u }
}

// La cuenta nace sin confirmar: no inicia sesión hasta ingresar el código
export const registrar = (v) => {
  const nuevo = {
    nombreUsuario: v.nombreUsuario, email: v.email.trim(), contrasena: v.pw,
    nombre: v.nombre.trim(), apellido: v.apellido.trim(),
    verificado: false, rol: 'COMPRADOR', estado: 'ACTIVO',
  }
  guardar(CLAVE_USUARIOS, [...getUsuarios(), nuevo])
  return nuevo
}

export const generarCodigo = (nombreUsuario) =>
  modificar(nombreUsuario, {
    codigo: String(Math.floor(100000 + Math.random() * 900000)),
    vence: Date.now() + VIDA_CODIGO,
    intentos: 0,
  })

export const marcarVerificada = (nombreUsuario) => {
  const u = modificar(nombreUsuario, { verificado: true, codigo: undefined, vence: undefined, intentos: undefined })
  guardar(CLAVE_SESION, nombreUsuario)
  return u
}

// Devuelve { user } o { error }
export const confirmarCodigo = (nombreUsuario, codigo) => {
  const u = buscar(nombreUsuario)
  const c = codigo.trim()
  if (!/^\d{6}$/.test(c)) return { error: 'Ingresá los 6 dígitos del código.', tipo: 'VALIDACION' }
  if (!u.codigo || u.vence < Date.now()) return { error: 'El código venció. Pedí uno nuevo.', tipo: 'CODIGO_VENCIDO' }
  if (u.intentos >= MAX_INTENTOS) return { error: 'Demasiados intentos. Pedí un código nuevo.', tipo: 'DEMASIADOS_INTENTOS' }
  if (c !== u.codigo) {
    const intentos = u.intentos + 1
    modificar(nombreUsuario, { intentos })
    return intentos >= MAX_INTENTOS
      ? { error: 'Demasiados intentos. Pedí un código nuevo.', tipo: 'DEMASIADOS_INTENTOS' }
      : { error: `Código incorrecto. Te quedan ${MAX_INTENTOS - intentos} intentos.`, tipo: 'CODIGO_INVALIDO' }
  }
  return { user: marcarVerificada(nombreUsuario) }
}

export const actualizarUsuario = (viejoNombre, cambios) => {
  const u = modificar(viejoNombre, cambios)
  guardar(CLAVE_SESION, u.nombreUsuario)
  return u
}

export const cerrarSesion = () => guardar(CLAVE_SESION, null)
