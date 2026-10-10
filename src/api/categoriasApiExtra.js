import {
  categoriasCargadas, crearCategoriaApi, darDeBajaCategoriaApi, listarCategoriasTodasApi, quitarImagenCategoriaApi,
  reactivarCategoriaApi, renombrarCategoriaApi, subirImagenCategoriaApi, urlImagenCategoria,
} from './categoriasApi'
import { dataUrlAFile } from './adaptadores'
import { norm } from '../utils/format'
import { mensajeError } from '../utils/errorApi'

const limpiar = (n) => n.trim().replace(/\s+/g, ' ')
const esFotoNueva = (imagen) => typeof imagen === 'string' && imagen.startsWith('data:')
const errorApi = (err) => new Error(mensajeError(err, 'registro'))

let todas = []
const cargar = async () => { todas = await listarCategoriasTodasApi(); return todas }
const buscar = (nombre) => todas.find((c) => c.nombre === nombre)
const existe = (nombre, excepto = '') => todas.some((c) => c.nombre !== excepto && norm(c.nombre) === norm(nombre))

export const imagenesDeCategorias = () =>
  Object.fromEntries(categoriasCargadas().filter((c) => c.tieneImagen).map((c) => [c.nombre, urlImagenCategoria(c.id)]))

// Todas (activas e inactivas), para el panel: [{ nombre, imagen, activa }]
export const listarCategoriasAdmin = async () =>
  (await cargar()).map((c) => ({ nombre: c.nombre, imagen: c.tieneImagen ? urlImagenCategoria(c.id) : '', activa: c.activa }))

export const crearCategoriaConFoto = async ({ nombre, imagen = '' }) => {
  const limpio = limpiar(nombre)
  await cargar()
  if (existe(limpio)) throw new Error('Esa categoría ya existe.')
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
  await cargar()
  if (existe(limpio, actual)) throw new Error('Ya hay otra categoría con ese nombre.')
  const cat = buscar(actual)
  if (!cat) throw new Error('No encontramos esa categoría.')
  try {
    if (limpio !== actual) await renombrarCategoriaApi(cat.id, limpio)
    if (esFotoNueva(imagen)) await subirImagenCategoriaApi(cat.id, await dataUrlAFile(imagen, 'categoria'))
    else if (!imagen && cat.tieneImagen) await quitarImagenCategoriaApi(cat.id)
  } catch (err) {
    throw errorApi(err)
  }
}

export const cambiarEstadoCategoria = async (nombre, activa) => {
  await cargar()
  const cat = buscar(nombre)
  if (!cat) throw new Error('No encontramos esa categoría.')
  try { await (activa ? reactivarCategoriaApi(cat.id) : darDeBajaCategoriaApi(cat.id)) } catch (err) { throw errorApi(err) }
}
