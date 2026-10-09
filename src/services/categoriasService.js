import { getCategoriasTodas } from './librosService'
import { categoriasCargadas, crearCategoriaApi, quitarImagenCategoriaApi, subirImagenCategoriaApi, urlImagenCategoria } from '../api/categoriasApi'
import { dataUrlAFile } from '../utils/adaptadores'
import { norm } from '../utils/format'
import { mensajeError } from '../utils/errorApi'

const limpiar = (n) => n.trim().replace(/\s+/g, ' ')

export const imagenesDeCategorias = () => {
  return Object.fromEntries(categoriasCargadas().filter((c) => c.tieneImagen).map((c) => [c.nombre, urlImagenCategoria(c.id)]))
}

// Todas (activas e inactivas), para el panel: [{ nombre, imagen, activa }]
export const listarCategoriasAdmin = async () => {
  const todas = await getCategoriasTodas()
  const urls = imagenesDeCategorias()
  return todas.map((nombre) => ({ nombre, imagen: urls[nombre] || '', activa: true }))
}

const existe = async (nombre, excepto = '') =>
  (await getCategoriasTodas()).some((c) => c !== excepto && norm(c) === norm(nombre))

const esFotoNueva = (imagen) => typeof imagen === 'string' && imagen.startsWith('data:')
const errorApi = (err) => new Error(mensajeError(err, 'registro'))

export const crearCategoriaConFoto = async ({ nombre, imagen = '' }) => {
  const limpio = limpiar(nombre)
  if (await existe(limpio)) throw new Error('Esa categoría ya existe.')
  let creada
  try { creada = await crearCategoriaApi(limpio) } catch (err) { throw errorApi(err) }
  if (esFotoNueva(imagen)) {
    try { await subirImagenCategoriaApi(creada.id, await dataUrlAFile(imagen, 'categoria')) } catch (err) {
      throw new Error(`La categoría se creó, pero no pudimos subir la imagen: ${errorApi(err).message} Editala para volver a intentarlo.`)
    }
  }
}

export const editarCategoria = async (actual, { nombre, imagen }) => {
  const limpio = limpiar(nombre)
  if (await existe(limpio, actual)) throw new Error('Ya hay otra categoría con ese nombre.')
  if (limpio !== actual) throw new Error('El servidor todavía no permite cambiar el nombre de una categoría.')
  const cat = categoriasCargadas().find((c) => c.nombre === actual)
  try {
    if (cat && esFotoNueva(imagen)) await subirImagenCategoriaApi(cat.id, await dataUrlAFile(imagen, 'categoria'))
    else if (cat && !imagen && cat.tieneImagen) await quitarImagenCategoriaApi(cat.id)
  } catch (err) {
    throw errorApi(err)
  }
}

export const cambiarEstadoCategoria = async () => {
  throw new Error('El servidor todavía no permite dar de baja categorías.')
}
