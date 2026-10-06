import { leer } from './almacen'
import { clavePedidos } from './claves'
import { getUsuarios } from './authService'
import { estadoPago } from '../utils/pedidos'
import { VENDEDOR_ALEPH, VENTAS_ALEPH } from '../data/vendedorPruebaMock'
import { USAR_API } from '../utils/modoApi'

// Ventas de una tienda = libros suyos dentro de pedidos pagados de cualquier cuenta.
// "Librería El Aleph" suma además su historial de ejemplo. Back: GET /ventas del vendedor.
const deEjemplo = (tienda) => (tienda === VENDEDOR_ALEPH.tienda ? VENTAS_ALEPH : [])

// Con el back (VITE_API=true) todavía no hay historial de ventas con detalle: GET /ordenes/vendedor solo trae { id, estado, idOrden, idVendedor }.
export const ventasDe = (tienda, libros) => USAR_API ? [] :
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
