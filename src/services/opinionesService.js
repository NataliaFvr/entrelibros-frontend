import { guardar, leer } from './almacen'
import { OPINIONES_ALEPH, VENDEDOR_ALEPH } from '../data/vendedorPruebaMock'

// Opiniones que dejó la gente sobre cada libro, guardadas en este navegador ({ [idLibro]: [...] }).
// Back: POST /libros/{id}/resenias (solo quien compró el libro)
const CLAVE = 'entrelibros_opiniones'

export const getOpiniones = (idLibro) => leer(CLAVE, {})[idLibro] || []

export const agregarOpinion = (idLibro, opinion) => {
  const todas = leer(CLAVE, {})
  todas[idLibro] = [opinion, ...(todas[idLibro] || [])]
  guardar(CLAVE, todas)
}

// Fecha como número para ordenar. Las de ejemplo traen `date`; las que se publican en este navegador traen i = -Date.now().
const marca = (r) => (r.date ? new Date(r.date.length === 10 ? `${r.date}T00:00` : r.date).getTime() : r.i < 0 ? -r.i : 0)

// Opiniones de ejemplo que vienen con el vendedor de prueba
const deEjemplo = (tienda) => (tienda === VENDEDOR_ALEPH.tienda ? OPINIONES_ALEPH : [])

// Todas las opiniones que recibieron los libros de un vendedor, la más reciente primero.
// Back: GET /vendedores/{id}/opiniones-libros (hoy: las propias de este navegador + las de ejemplo)
export const getOpinionesVendedor = async (tienda, publicaciones) => {
  const propias = publicaciones.flatMap((p) =>
    getOpiniones(p.id).map((r) => ({ ...r, libro: p.t, clave: `${p.id}-${r.u}-${r.i}` })))
  const ejemplo = deEjemplo(tienda).map((r) => ({ ...r, clave: r.id }))
  return [...propias, ...ejemplo].sort((a, b) => marca(b) - marca(a))
}
