// import api from '../api/axiosConfig'
import { CATEGORIAS, generarLibros } from '../data/mockLibros'
import { generarResenias } from '../data/mockResenias'
import { librosPublicados } from './vendedorService'

// Punto único de acceso a datos. Hoy devuelve los datos de ejemplo;
// cuando estén los endpoints, cada función pasa a usar `api.get(...)` sin tocar los componentes.

export async function getLibros() {
  // return (await api.get('/libros')).data
  return [...generarLibros(), ...librosPublicados()]
}

export async function getCategorias() {
  // return (await api.get('/categorias')).data
  return CATEGORIAS
}

export async function getResenias(libroId) {
  // return (await api.get(`/libros/${libroId}/resenias`)).data
  return generarResenias(libroId)
}
