import { leer } from './almacen'
import { clavePedidos } from './claves'
import { getUsuarios } from './authService'
import { estadoPago } from '../utils/pedidos'
import { VENDEDOR_ALEPH, VENTAS_ALEPH } from '../data/vendedorPruebaMock'

// Ventas de una tienda = libros suyos dentro de pedidos pagados de cualquier cuenta.
// "Librería El Aleph" suma además su historial de ejemplo. Solo para el modo demo: con el back las ventas salen de
// api/ventasApi.js + aVentaFront (ver hooks/useVentas.js).
const deEjemplo = (tienda) => (tienda === VENDEDOR_ALEPH.tienda ? VENTAS_ALEPH : [])

export const ventasDe = (tienda, libros) =>
  [...getUsuarios()
    .flatMap((u) => leer(clavePedidos(u), [])
      .filter((o) => estadoPago(o) === 'SIMULADO_APROBADO')
      .map((o) => {
        const its = o.its
          .map((i) => {
            const l = libros.find((x) => x.id === i.id)
            return l && l.v === tienda ? { t: l.t, q: i.q, p: i.p, cat: l.cat, usado: l.usado } : null
          })
          .filter(Boolean)
        return its.length ? { n: o.n, date: o.date, est: o.est, its, comprador: `${u.nombre} ${u.apellido}` } : null
      })
      .filter(Boolean)), ...deEjemplo(tienda)]
    .sort((a, b) => b.date.localeCompare(a.date))
