import api from './axiosConfig'
import { traerPaginas } from './librosApi'
import { aUsuarioFront } from '../utils/adaptadores'

// UsuariosController

export const listarUsuariosApi = async () => (await traerPaginas('/usuarios')).map(aUsuarioFront)

export const crearUsuarioApi = async (v) =>
  aUsuarioFront((await api.post('/usuarios', {
    nombreUsuario: v.nombreUsuario.trim(), email: v.email.trim(), contrasena: v.pw, nombre: v.nombre.trim(), apellido: v.apellido.trim(), rol: v.rol,
  })).data)

// PATCH /usuarios/{id}: solo se aplican los campos que vienen (UsuarioUpdateRequest)
export const actualizarUsuarioApi = async (id, cambios) => {
  const u = aUsuarioFront((await api.patch(`/usuarios/${id}`, cambios)).data)
  return u
}

export const darDeBajaUsuarioApi = async (id) => (await api.patch(`/usuarios/${id}/baja`)).data
export const reactivarUsuarioApi = async (id) => (await api.patch(`/usuarios/${id}/reactivar`)).data
export const cambiarRolApi = async (id, rol) => (await api.patch(`/usuarios/${id}/rol`, { rol })).data

// COMPRADOR pide ser vendedor: { nombreTienda } (el back no guarda teléfono ni descripción)
export const solicitarVendedorApi = async (nombreTienda) => aUsuarioFront((await api.post('/usuarios/solicitud-vendedor', { nombreTienda })).data)

// ADMIN: solicitudes pendientes y su resolución (aprobar y comentario viajan como query params, no como body)
export const listarSolicitudesApi = async () => (await traerPaginas('/usuarios/solicitudes-vendedor')).map(aUsuarioFront)
export const resolverSolicitudApi = async (id, aprobar, comentario) =>
  (await api.patch(`/usuarios/${id}/solicitud-vendedor`, null, { params: { aprobar, ...(comentario ? { comentario } : {}) } })).data
