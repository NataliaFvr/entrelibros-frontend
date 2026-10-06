import api from './axiosConfig'
import { norm } from '../utils/format'

// CategoriasController: GET /categorias -> [{ id, nombre }] (404 si no hay ninguna), POST /categorias { nombre } (ADMIN)
let cache = []

export const listarCategoriasApi = async () => {
  try {
    const { data } = await api.get('/categorias')
    cache = Array.isArray(data) ? data : []
  } catch (err) {
    if (err.response && err.response.status === 404) cache = []
    else throw err
  }
  return cache
}

export const categoriasCargadas = () => cache

// El back guarda las categorías de un libro por id: se traduce desde el nombre que usa el formulario
export const idsDeCategorias = async (nombres = []) => {
  if (!cache.length) await listarCategoriasApi()
  return nombres.filter(Boolean).map((n) => cache.find((c) => norm(c.nombre) === norm(n))).filter(Boolean).map((c) => c.id)
}

export const crearCategoriaApi = async (nombre) => (await api.post('/categorias', { nombre })).data
