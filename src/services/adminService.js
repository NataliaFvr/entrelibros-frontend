import { leer, mover } from './almacen'
import { getUsuarios, guardarUsuarios } from './authService'
import { claveCart, claveDir, claveMarks, claveNotifs, clavePedidos, clavePerfil, claveVendedor } from './claves'
import { getNotificaciones, guardarNotificaciones } from './notificacionesService'
import { getVendedor, guardarVendedor } from './vendedorService'
import { estadoPago } from '../utils/pedidos'

// Servicio del panel de administración en modo demostración: usuarios y pedidos guardados en este navegador.
// Cada función lanza un Error con mensaje en español si algo falla; la UI solo muestra `message`.
// Back (todos @PreAuthorize ADMIN): GET/POST /usuarios, PATCH /usuarios/{id}, DELETE /usuarios/{id} (baja lógica),
// PATCH /usuarios/{id}/rol, PATCH /usuarios/{id}/reactivar, GET /ordenes. Cuando estén, solo cambia este archivo.

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
  const duplicado = mensajeDuplicado(v, id)
  if (duplicado) throw new Error(duplicado)
  const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() }
  if (v.pw) cambios.contrasena = v.pw
  const nuevo = modificar(id, cambios)
  if (nuevo.nombreUsuario !== id) CLAVES_POR_CUENTA.forEach((clave) => mover(clave({ nombreUsuario: id }), clave(nuevo)))
}

export const darDeBaja = (id) => { modificar(id, { estado: 'DADO_DE_BAJA' }) }
export const reactivar = (id) => { modificar(id, { estado: 'ACTIVO' }) }

// Solicitud "quiero vender": aprobar = pasar a VENDEDOR; rechazar la devuelve a comprador común y avisa
export const resolverSolicitudVenta = (id, aprobada) => {
  if (aprobada) return cambiarRol(id, 'VENDEDOR')
  const u = buscar(id)
  guardarVendedor(u, { ...getVendedor(u), estado: 'ninguno' })
  notificar(u, 'Tu solicitud para ser vendedor fue rechazada. Podés volver a enviarla desde "Vender".')
}

// Todos los pedidos de todas las cuentas: [{ n, fecha, comprador, total, estadoPago }]
export const listarOrdenes = () =>
  getUsuarios().flatMap((u) =>
    leer(clavePedidos(u), []).map((o) => ({
      n: o.n, fecha: o.date, comprador: `${u.nombre} ${u.apellido}`, total: o.sub + o.env, estadoPago: estadoPago(o),
    })))
