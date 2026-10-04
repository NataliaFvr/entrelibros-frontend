import { leer } from './almacen'

// Reseñas que los compradores le dejan a un vendedor: { v: tienda, st: 1-5, t, ... }
// Misma clave que usa el HTML de referencia. Back: ResenaVendedor.
const CLAVE = 'entrelibros_resenas_vend'

export const reputacionVendedor = (tienda) => {
  const mias = leer(CLAVE, []).filter((r) => r.v === tienda)
  const promedio = mias.length ? mias.reduce((a, r) => a + r.st, 0) / mias.length : 0
  return { promedio, cantidad: mias.length }
}
