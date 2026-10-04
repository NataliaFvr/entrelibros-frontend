import { CUENTA_VENDEDOR_DEMO } from './cuentasDemo'

// Notificaciones de ejemplo que reciben las cuentas de prueba la primera vez que entran.
// Back: las genera el servidor (aprobación de vendedor, moderación de libros, pago y compra confirmados).
const MIN = 60000
const HORA = 60 * MIN
const DIA = 24 * HORA
const COMPRADOR_DEMO = 'usuario_prueba'

const nueva = (id, texto, haceMs) => ({ id, texto, fecha: Date.now() - haceMs, leida: false })

export const notificacionesIniciales = (u) => {
  if (u.rol === 'VENDEDOR') {
    const lista = [nueva('d2-v1', '¡Tu solicitud para vender en EntreLibros fue aprobada por el administrador!', 3 * DIA)]
    // Este libro es del catálogo de la tienda demo (data/vendedorPruebaMock.js)
    if (u.nombreUsuario === CUENTA_VENDEDOR_DEMO.nombreUsuario) {
      lista.unshift(nueva('d2-v2', "Tu publicación 'Noche de vidrio' ya está disponible en el catálogo.", DIA))
    }
    return lista
  }
  if (u.nombreUsuario === COMPRADOR_DEMO) {
    return [
      nueva('d2-c2', "Tu pago para el libro 'El relojero' ha sido procesado correctamente.", 2 * HORA),
      nueva('d2-c1', "¡Compra confirmada! Recibirás los detalles de tu pedido VT-2040 'Noche de vidrio' por correo.", 5 * HORA),
    ]
  }
  return []
}
