import { getLibrosApi } from '../api/librosApi'
import { listarCategoriasApi } from '../api/categoriasApi'
import { getResenasLibroApi } from '../api/resenasApi'
import { USAR_API } from '../utils/modoApi'
import { CATEGORIAS, generarLibros } from '../data/mockLibros'
import { leer } from './almacen'
import { generarResenias } from '../data/mockResenias'
import { LIBROS_PRUEBA } from '../data/vendedorPruebaMock'
import { idsGestionados, librosPublicados } from './vendedorService'

// Punto único de acceso a datos. Con VITE_API=true usa el back (GET /libros, /categorias, /resenas-libro/libro/{id});
// si no, devuelve los datos de ejemplo. Los componentes no se enteran de cuál de los dos es.

export async function getLibros() {
  if (USAR_API) return getLibrosApi()
  const gestionados = idsGestionados()
  return [...generarLibros().filter((l) => !gestionados.has(l.id)), ...librosPublicados(), ...LIBROS_PRUEBA]
}

// Las categorías que crea el administrador se guardan en este navegador (la lista completa, en orden de creación)
export const CLAVE_CATEGORIAS = 'entrelibros_cats'

export async function getCategorias() {
  if (USAR_API) return (await listarCategoriasApi()).map((c) => c.nombre) // el back devuelve [{ id, nombre }]
  const guardadas = leer(CLAVE_CATEGORIAS, null)
  const ok = Array.isArray(guardadas) && guardadas.length > 0 && guardadas.every((c) => typeof c === 'string' && c.trim())
  return ok ? guardadas : CATEGORIAS
}

// Ids de los libros de ejemplo del catálogo: solo ellos traen reseñas ficticias.
// Una publicación nueva de un vendedor arranca SIN opiniones (antes cualquier id recibía reseñas inventadas).
const IDS_EJEMPLO = new Set([...generarLibros().map((l) => l.id), ...LIBROS_PRUEBA.map((l) => l.id)])

export async function getResenias(libroId) {
  if (USAR_API) return getResenasLibroApi(libroId) // GET /resenas-libro/libro/{idLibro}; sin reseñas = []
  return IDS_EJEMPLO.has(libroId) ? generarResenias(libroId) : []
}
