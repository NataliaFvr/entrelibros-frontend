import api, { RAIZ } from './axiosConfig'
import { aCategoriaFront } from './adaptadores'
import { norm } from '../utils/format'
import { esListaVacia } from '../utils/errorApi'

// CategoriasController + ImagenesCategoriaController
//   GET    /categorias                  -> [{ id, nombre }] (404 si no hay ninguna). Público.
//   POST   /categorias { nombre }       -> { id, nombre } (ADMIN)
//   GET    /categorias/{id}/imagen      -> bytes de la imagen (público, sirve de src de un <img>); 404 si no tiene
//   POST   /categorias/{id}/imagen      multipart "archivo" (ADMIN): sube o reemplaza la imagen
//   DELETE /categorias/{id}/imagen      (ADMIN): la quita (el front vuelve al círculo con la inicial)
let cache = []
const versiones = new Map() // id -> número que cambia al subir/quitar, para que el navegador no muestre la imagen vieja

export const listarCategoriasApi = async () => {
  try {
    const { data } = await api.get('/categorias')
    cache = Array.isArray(data) ? data.map(aCategoriaFront) : []
  } catch (err) {
    if (esListaVacia(err)) cache = []
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

export const crearCategoriaApi = async (nombre) => aCategoriaFront((await api.post('/categorias', { nombre })).data)

/* ---------- Imágenes ---------- */

// URL del <img> de una categoría. El componente muestra la inicial si la imagen deja de estar disponible.
export const urlImagenCategoria = (id) => `${RAIZ}/categorias/${id}/imagen${versiones.has(id) ? `?v=${versiones.get(id)}` : ''}`

const recordar = (id, tieneImagen) => {
  versiones.set(id, Date.now())
  cache = cache.map((c) => (c.id === id ? { ...c, tieneImagen } : c))
}

export const subirImagenCategoriaApi = async (id, archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const { data } = await api.post(`/categorias/${id}/imagen`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  recordar(id, true)
  return data
}

export const quitarImagenCategoriaApi = async (id) => {
  try {
    await api.delete(`/categorias/${id}/imagen`)
  } catch (err) {
    if (!(err.response && err.response.status === 404)) throw err // 404 = ya no tenía imagen
  }
  recordar(id, false)
}
