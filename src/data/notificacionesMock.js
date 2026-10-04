import { CUENTA_VENDEDOR_DEMO } from './cuentasDemo'

// Notificaciones de ejemplo que reciben las cuentas de prueba la primera vez que entran.
// Back: las genera el servidor (aprobación de vendedor, moderación de libros, cambios de estado del pedido).
const MIN = 60000
const HORA = 60 * MIN
const DIA = 24 * HORA
const COMPRADOR_DEMO = 'usuario_prueba'

const nueva = (id, texto, haceMs) => ({ id, texto, fecha: Date.now() - haceMs, leida: false })

export const notificacionesIniciales = (u) => {
  if (u.rol === 'VENDEDOR') {
    const tienda = u.tienda || `${u.nombre} ${u.apellido}`
    const lista = [nueva('n-v1', `¡Tu solicitud para vender en EntreLibros fue aprobada por el administrador! Bienvenida, ${tienda}.`, 3 * DIA)]
    // Estos dos libros son del catálogo de la tienda demo (data/vendedorPruebaMock.js)
    if (u.nombreUsuario === CUENTA_VENDEDOR_DEMO.nombreUsuario) {
      lista.unshift(
        nueva('n-v3', "Tu publicación 'El relojero' fue aprobada y está activa.", 2 * HORA),
        nueva('n-v2', "Tu publicación 'Noche de vidrio' fue aprobada y ya está visible en el catálogo.", DIA),
      )
    }
    return lista
  }
  if (u.nombreUsuario === COMPRADOR_DEMO) {
    return [nueva('n-c1', "Tu pedido VT-2040 'Noche de vidrio' ha sido enviado por el vendedor.", 5 * HORA)]
  }
  return []
}
