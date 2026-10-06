import { guardar, leer } from './almacen'
import { RESENIAS_ALEPH, RESENIAS_PRUEBA, VENDEDOR_ALEPH, VENDEDOR_PRUEBA } from '../data/vendedorPruebaMock'

// Reseñas que los compradores le dejan a un vendedor: { id, v: tienda, u: usuario, nc, st: 1-5, t, libro, date }
// Misma clave que usa el HTML de referencia. Back: ResenaVendedor.
const CLAVE = 'entrelibros_resenas_vend'

// Reseñas de ejemplo que vienen con el vendedor de prueba
const deEjemplo = (tienda) => {
  if (tienda === VENDEDOR_PRUEBA.tienda) return RESENIAS_PRUEBA
  if (tienda === VENDEDOR_ALEPH.tienda) return RESENIAS_ALEPH
  return []
}

// Todas las reseñas de un vendedor, la más reciente primero. Back: GET /vendedores/{id}/resenias
export const getResenasVendedor = (tienda) =>
  [...leer(CLAVE, []).filter((r) => r.v === tienda), ...deEjemplo(tienda)]
    .sort((a, b) => new Date(b.date) - new Date(a.date))

// Una reseña por comprador y vendedor: si ya había una, se reemplaza. Back: POST /vendedores/{id}/resenias
export const agregarResenaVendedor = (tienda, resena) => {
  const resto = leer(CLAVE, []).filter((r) => !(r.v === tienda && r.u === resena.u))
  guardar(CLAVE, [{ id: Date.now(), v: tienda, date: new Date().toISOString(), ...resena }, ...resto])
}

export const reputacionVendedor = (tienda) => {
  const todas = getResenasVendedor(tienda)
  const promedio = todas.length ? todas.reduce((a, r) => a + r.st, 0) / todas.length : 0
  return { promedio, cantidad: todas.length }
}

// Con el back (ResenaVendedorResponse solo trae el nombre del comprador) se recuerda en este navegador cuál es mi reseña de cada vendedor
const claveMia = (u) => `entrelibros_resena_vend_api_${u.nombreUsuario}`
export const miResenaId = (u, idVendedor) => leer(claveMia(u), {})[idVendedor] ?? null
export const guardarMiResenaId = (u, idVendedor, idResena) => guardar(claveMia(u), { ...leer(claveMia(u), {}), [idVendedor]: idResena })
