import { listarOrdenesAdminApi, listarPagosAdminApi } from './comprasApi'
import { crearCategoriaApi } from './categoriasApi'
import {
  actualizarUsuarioApi, cambiarRolApi, crearUsuarioApi, darDeBajaUsuarioApi, listarUsuariosApi, reactivarUsuarioApi, resolverSolicitudApi,
} from './usuariosApi'
import { mensajeError } from '../utils/errorApi'

const conBack = async (fn) => {
  try { return await fn() } catch (err) { throw new Error(mensajeError(err, 'registro')) }
}

export const mensajeDuplicado = () => ''

export const cambiarRol = (id, rol) => conBack(() => cambiarRolApi(id, rol))
export const crearUsuario = (v) => {
  if (!['COMPRADOR', 'VENDEDOR'].includes(v.rol)) throw new Error('Desde el panel solo se pueden crear compradores o vendedores.')
  return conBack(() => crearUsuarioApi(v))
}

export const editarUsuario = (id, v) => {
  const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
  if (v.pw) cambios.contrasena = v.pw
  return conBack(() => actualizarUsuarioApi(id, cambios))
}

export const darDeBaja = (id) => conBack(() => darDeBajaUsuarioApi(id))
export const reactivar = (id) => conBack(() => reactivarUsuarioApi(id))
export const resolverSolicitudVenta = (id, aprobada) => conBack(() => resolverSolicitudApi(id, aprobada))

export const cargarUsuarios = async () => {
  const lista = await conBack(() => listarUsuariosApi())
  return lista.map((u) => ({ ...u, quiereVender: u.estadoSolicitud === 'PENDIENTE' }))
}

export const cargarOrdenes = async () => {
  const [ordenes, pagos] = await conBack(() => Promise.all([listarOrdenesAdminApi(), listarPagosAdminApi()]))
  const proveedores = new Map(pagos.map((p) => [p.idOrden, p.proveedor]))
  return ordenes.map((o) => ({
    n: o.n, fecha: o.date, comprador: o.comprador, provincia: o.dest.prov || o.addr, destino: o.addr,
    subtotal: o.sub, envio: o.env, total: o.total, estadoPago: o.pago,
    proveedor: proveedores.get(o.idOrden) || 'tarjeta', items: o.its,
  }))
}

export const cargarPagos = async () => {
  const pagos = await conBack(() => listarPagosAdminApi())
  return pagos.map((p) => ({ id: p.id, n: p.idOrden, proveedor: p.proveedor, monto: p.totalOrden, resultado: p.resultado }))
}

export const crearCategoria = (nombre) => conBack(() => crearCategoriaApi(nombre.trim().replace(/\s+/g, ' ')))
