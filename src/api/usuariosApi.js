import api, { RAIZ } from './axiosConfig'
import { traerPaginas } from './librosApi'
import { aUsuarioFront } from './adaptadores'

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

// COMPRADOR pide ser vendedor: { nombreTienda, telefono, descripcion, provincia }
export const solicitarVendedorApi = async ({ tienda, tel, desc, prov }) =>
  aUsuarioFront((await api.post('/usuarios/solicitud-vendedor', {
    nombreTienda: tienda, telefono: tel, descripcion: desc, provincia: prov,
  })).data)

// ADMIN: solicitudes pendientes y su resolución (aprobar y comentario viajan como query params, no como body)
export const listarSolicitudesApi = async () => (await traerPaginas('/usuarios/solicitudes-vendedor')).map(aUsuarioFront)
export const resolverSolicitudApi = async (id, aprobar, comentario) =>
  (await api.patch(`/usuarios/${id}/solicitud-vendedor`, null, { params: { aprobar, ...(comentario ? { comentario } : {}) } })).data

/* ---------- Foto de perfil (ImagenesUsuarioController) ----------
   GET    /usuarios/{id}/foto  -> bytes de la imagen (público, src de un <img>); 404 si no tiene
   POST   /usuarios/{id}/foto  multipart "archivo" (dueño o ADMIN): sube o reemplaza
   DELETE /usuarios/{id}/foto  (dueño o ADMIN): la quita
   El avatar por defecto NO es una foto: es una clave ("zorro", "buho"…) que se guarda con PATCH /usuarios/{id} { avatar }
   ("" lo borra). UsuarioResponse trae `avatar` y `tieneFoto`. */

const versionesFoto = new Map() // id -> número que cambia al subir/quitar, para no mostrar la foto vieja del caché

export const urlFotoUsuario = (id) => `${RAIZ}/usuarios/${id}/foto${versionesFoto.has(id) ? `?v=${versionesFoto.get(id)}` : ''}`

export const subirFotoUsuarioApi = async (id, archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const { data } = await api.post(`/usuarios/${id}/foto`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  versionesFoto.set(id, Date.now())
  return data
}

export const quitarFotoUsuarioApi = async (id) => {
  try {
    await api.delete(`/usuarios/${id}/foto`)
  } catch (err) {
    if (!(err.response && err.response.status === 404)) throw err // 404 = ya no tenía foto
  }
  versionesFoto.set(id, Date.now())
}
