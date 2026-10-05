// import api from '../api/axiosConfig'
import { CATEGORIAS, generarLibros } from '../data/mockLibros'
import { leer } from './almacen'
import { generarResenias } from '../data/mockResenias'
import { LIBROS_PRUEBA } from '../data/vendedorPruebaMock'
import { idsGestionados, librosPublicados } from './vendedorService'

// Punto único de acceso a datos. Hoy devuelve los datos de ejemplo;
// cuando estén los endpoints, cada función pasa a usar `api.get(...)` sin tocar los componentes.

export async function getLibros() {
  // return (await api.get('/libros')).data
  const gestionados = idsGestionados()
  return [...generarLibros().filter((l) => !gestionados.has(l.id)), ...librosPublicados(), ...LIBROS_PRUEBA]
}

// Las categorías que crea el administrador se guardan en este navegador (la lista completa, en orden de creación)
export const CLAVE_CATEGORIAS = 'entrelibros_cats'

export async function getCategorias() {
  // return (await api.get('/categorias')).data
  const guardadas = leer(CLAVE_CATEGORIAS, null)
  const ok = Array.isArray(guardadas) && guardadas.length > 0 && guardadas.every((c) => typeof c === 'string' && c.trim())
  return ok ? guardadas : CATEGORIAS
}

// Ids de los libros de ejemplo del catálogo: solo ellos traen reseñas ficticias.
// Una publicación nueva de un vendedor arranca SIN opiniones (antes cualquier id recibía reseñas inventadas).
const IDS_EJEMPLO = new Set([...generarLibros().map((l) => l.id), ...LIBROS_PRUEBA.map((l) => l.id)])

export async function getResenias(libroId) {
  // return (await api.get(`/libros/${libroId}/resenias`)).data  (ResenaLibroController; un libro nuevo devuelve [])
  return IDS_EJEMPLO.has(libroId) ? generarResenias(libroId) : []
}
