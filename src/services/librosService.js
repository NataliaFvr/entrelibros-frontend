// import api from '../api/axiosConfig'
import { CATEGORIAS, generarLibros } from '../data/mockLibros'
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

export async function getCategorias() {
  // return (await api.get('/categorias')).data
  return CATEGORIAS
}

// Ids de los libros de ejemplo del catálogo: solo ellos traen reseñas ficticias.
// Una publicación nueva de un vendedor arranca SIN opiniones (antes cualquier id recibía reseñas inventadas).
const IDS_EJEMPLO = new Set([...generarLibros().map((l) => l.id), ...LIBROS_PRUEBA.map((l) => l.id)])

export async function getResenias(libroId) {
  // return (await api.get(`/libros/${libroId}/resenias`)).data  (ResenaLibroController; un libro nuevo devuelve [])
  return IDS_EJEMPLO.has(libroId) ? generarResenias(libroId) : []
}
