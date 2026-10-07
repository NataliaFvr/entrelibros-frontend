import { guardar, leer, mover } from './almacen'
import { getUsuarios, guardarUsuarios } from './authService'
import { claveCart, claveDir, claveMarks, claveNotifs, clavePedidos, clavePerfil, claveVendedor } from './claves'
import { guardarTarifa } from './enviosService'
import { CLAVE_CATEGORIAS, getCategorias } from './librosService'
import { getNotificaciones, guardarNotificaciones } from './notificacionesService'
import { getVendedor, guardarVendedor } from './vendedorService'
import { norm } from '../utils/format'
import { estadoPago } from '../utils/pedidos'
import { listarOrdenesAdminApi, listarPagosAdminApi } from '../api/comprasApi'
import { crearCategoriaApi } from '../api/categoriasApi'
import {
  actualizarUsuarioApi, cambiarRolApi, crearUsuarioApi, darDeBajaUsuarioApi, listarUsuariosApi, reactivarUsuarioApi, resolverSolicitudApi,
} from '../api/usuariosApi'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'

// Servicio del panel de administración. Sin VITE_API: modo demostración (usuarios y pedidos guardados en este navegador).
// Con VITE_API=true usa el back (todos @PreAuthorize ADMIN): GET/POST /usuarios, PATCH /usuarios/{id}, PATCH /usuarios/{id}/baja,
// PATCH /usuarios/{id}/reactivar, PATCH /usuarios/{id}/rol, PATCH /usuarios/{id}/solicitud-vendedor?aprobar=…, GET /ordenes, GET /pagos
// y POST /categorias. En modo API las funciones devuelven una Promesa. Cada una lanza un Error con mensaje en español si algo falla;
// la UI solo muestra `message`. Las tarifas de envío quedan como en el front (guardadas en el navegador).

// Con el back: el error de la API se convierte en un Error con el mensaje que manda el back
const conBack = async (fn) => {
  try { return await fn() } catch (err) { throw new Error(mensajeError(err, 'registro')) }
}

const SIN_ESPACIO = 'No pudimos guardar: sin espacio en el navegador.'
const CLAVES_POR_CUENTA = [claveMarks, claveCart, clavePerfil, claveDir, clavePedidos, claveVendedor, claveNotifs]

const buscar = (id) => getUsuarios().find((u) => u.nombreUsuario === id)

const guardarLista = (lista) => {
  if (!guardarUsuarios(lista)) throw new Error(SIN_ESPACIO)
}

const modificar = (id, cambios) => {
  guardarLista(getUsuarios().map((u) => (u.nombreUsuario === id ? { ...u, ...cambios } : u)))
  return buscar(cambios.nombreUsuario || id)
}

const notificar = (u, texto) =>
  guardarNotificaciones(u, [{ id: `adm-${Date.now()}`, texto, fecha: Date.now(), leida: false }, ...getNotificaciones(u)])

// Mensaje si el usuario o el e-mail ya los tiene otra cuenta ('' = libre). `actual` = la cuenta que se edita.
export const mensajeDuplicado = (v, actual = '') => {
  if (USAR_API) return '' // lo valida el back (400 "Ya existe un usuario con ese email o nombre de usuario")
  const repetido = (campo) =>
    getUsuarios().some((u) => u.nombreUsuario !== actual && String(u[campo]).toLowerCase() === String(v[campo]).trim().toLowerCase())
  if (repetido('nombreUsuario')) return 'Ese nombre de usuario ya está en uso.'
  if (repetido('email')) return 'Ese e-mail ya tiene una cuenta.'
  return ''
}

export const listarUsuarios = () =>
  getUsuarios().map((u) => ({
    id: u.nombreUsuario, nombreUsuario: u.nombreUsuario, nombre: u.nombre, apellido: u.apellido, email: u.email,
    rol: u.rol, estado: u.estado || 'ACTIVO', quiereVender: getVendedor(u).estado === 'pendiente',
  }))

// Pasar a VENDEDOR aprueba la tienda; salir de VENDEDOR la deshabilita (conserva sus publicaciones por si vuelve)
export const cambiarRol = (id, rol, avisar = true) => {
  if (USAR_API) return conBack(() => cambiarRolApi(id, rol))
  const antes = buscar(id).rol
  const u = modificar(id, { rol })
  const v = getVendedor(u)
  if (rol === 'VENDEDOR') {
    const tienda = v.tienda || `${u.nombre} ${u.apellido}`
    if (!guardarVendedor(u, { ...v, estado: 'aprobado', tienda, prov: v.prov || 'Buenos Aires', pub: v.pub || [] })) throw new Error(SIN_ESPACIO)
    if (avisar && antes !== 'VENDEDOR') notificar(u, '¡Tu solicitud para ser vendedor fue aprobada! Ya podés publicar libros desde "Vender".')
  } else if (v.estado !== 'ninguno') {
    guardarVendedor(u, { ...v, estado: 'ninguno' })
  }
}

// v = { nombre, apellido, nombreUsuario, email, pw, rol }. La cuenta nace confirmada y activa.
export const crearUsuario = (v) => {
  if (!['COMPRADOR', 'VENDEDOR'].includes(v.rol)) throw new Error('Desde el panel solo se pueden crear compradores o vendedores.')
  if (USAR_API) return conBack(() => crearUsuarioApi(v))
  const duplicado = mensajeDuplicado(v)
  if (duplicado) throw new Error(duplicado)
  guardarLista([...getUsuarios(), {
    nombreUsuario: v.nombreUsuario, email: v.email.trim(), contrasena: v.pw, nombre: v.nombre.trim(), apellido: v.apellido.trim(),
    verificado: true, rol: 'COMPRADOR', estado: 'ACTIVO',
  }])
  if (v.rol !== 'COMPRADOR') cambiarRol(v.nombreUsuario, v.rol, false)
}

// Si cambia el nombre de usuario, todo lo de la cuenta (carrito, pedidos, tienda…) se muda a la clave nueva
export const editarUsuario = (id, v) => {
  if (USAR_API) {
    const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
    if (v.pw) cambios.contrasena = v.pw
    return conBack(() => actualizarUsuarioApi(id, cambios))
  }
  const duplicado = mensajeDuplicado(v, id)
  if (duplicado) throw new Error(duplicado)
  const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
  if (v.pw) cambios.contrasena = v.pw
  const nuevo = modificar(id, cambios)
  if (nuevo.nombreUsuario !== id) CLAVES_POR_CUENTA.forEach((clave) => mover(clave({ nombreUsuario: id }), clave(nuevo)))
}

export const darDeBaja = (id) => {
  if (USAR_API) return conBack(() => darDeBajaUsuarioApi(id))
  modificar(id, { estado: 'DADO_DE_BAJA' })
  return undefined
}
export const reactivar = (id) => {
  if (USAR_API) return conBack(() => reactivarUsuarioApi(id))
  modificar(id, { estado: 'ACTIVO' })
  return undefined
}

// Solicitud "quiero vender": aprobar = pasar a VENDEDOR; rechazar la devuelve a comprador común y avisa
export const resolverSolicitudVenta = (id, aprobada) => {
  if (USAR_API) return conBack(() => resolverSolicitudApi(id, aprobada))
  if (aprobada) return cambiarRol(id, 'VENDEDOR')
  const u = buscar(id)
  guardarVendedor(u, { ...getVendedor(u), estado: 'ninguno' })
  notificar(u, 'Tu solicitud para ser vendedor fue rechazada. Podés volver a enviarla desde "Vender".')
}

// Provincia de destino: lo que va entre la última coma y el código postal de "Casa — calle, ciudad, Provincia (CP)"
const provinciaDe = (direccion = '') => (direccion.split(', ').pop() || '').replace(/ \(.*\)$/, '')

// Todas las órdenes de todas las cuentas (solo lectura). Back: GET /ordenes
export const listarOrdenes = () =>
  getUsuarios().flatMap((u) =>
    leer(clavePedidos(u), []).map((o) => ({
      n: o.n, fecha: o.date, comprador: `${u.nombre} ${u.apellido}`, provincia: provinciaDe(o.addr), destino: o.addr,
      subtotal: o.sub, envio: o.env, total: o.sub + o.env, estadoPago: estadoPago(o),
      proveedor: o.proveedor || 'tarjeta', items: o.its,
    })))

// Pagos registrados: una orden pagada o con pago rechazado es un pago. Se numeran de la más vieja a la más nueva.
// Back: GET /pagos
export const listarPagos = () =>
  listarOrdenes()
    .filter((o) => o.estadoPago === 'SIMULADO_APROBADO' || o.estadoPago === 'RECHAZADO')
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.n.localeCompare(b.n))
    .map((o, i) => ({ id: i + 1, n: o.n, proveedor: o.proveedor, monto: o.total, resultado: o.estadoPago }))

// Categorías: solo se pueden crear (no editar ni borrar). El nombre no puede repetirse, sin importar mayúsculas ni tildes.
// Back: POST /categorias {nombre}
export const crearCategoria = async (nombre) => {
  const limpio = nombre.trim().replace(/\s+/g, ' ')
  if (USAR_API) return conBack(() => crearCategoriaApi(limpio)) // 400 si ya existe una con ese nombre
  const actuales = await getCategorias()
  if (actuales.some((c) => norm(c) === norm(limpio))) throw new Error('Esa categoría ya existe.')
  if (!guardar(CLAVE_CATEGORIAS, [...actuales, limpio])) throw new Error(SIN_ESPACIO)
}

// Tarifas de envío. `tipo`: 'misma' | 'distinta'. Back: POST /envios {zona, costoFijo}
export const cambiarTarifaEnvio = (tipo, costo) => {
  if (!guardarTarifa(tipo, costo)) throw new Error(SIN_ESPACIO)
}

/* ---------- Carga de listas (sirve para los dos modos: devuelven una Promesa) ---------- */

// { id, nombreUsuario, nombre, apellido, email, rol, estado, quiereVender }
export const cargarUsuarios = async () => {
  if (!USAR_API) return listarUsuarios()
  const lista = await conBack(() => listarUsuariosApi())
  return lista.map((u) => ({ ...u, quiereVender: u.estadoSolicitud === 'PENDIENTE' }))
}

// { n, fecha, comprador, provincia, subtotal, envio, total, estadoPago, proveedor, items }
export const cargarOrdenes = async () => {
  if (!USAR_API) return listarOrdenes()
  const [ordenes, pagos] = await conBack(() => Promise.all([listarOrdenesAdminApi(), listarPagosAdminApi()]))
  const proveedores = new Map(pagos.map((p) => [p.idOrden, p.proveedor]))
  return ordenes.map((o) => ({
    n: o.n, fecha: o.date, comprador: o.comprador, provincia: o.dest.prov || o.addr, destino: o.addr, subtotal: o.sub, envio: o.env, total: o.sub + o.env,
    estadoPago: o.pago, proveedor: proveedores.get(o.idOrden) || 'tarjeta', items: o.its,
  }))
}

// { id, n, proveedor, monto, resultado }
export const cargarPagos = async () => {
  if (!USAR_API) return listarPagos()
  const pagos = await conBack(() => listarPagosAdminApi())
  return pagos.map((p) => ({ id: p.id, n: p.idOrden, proveedor: p.proveedor, monto: p.totalOrden, resultado: p.resultado }))
}
