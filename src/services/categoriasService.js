import { guardar } from './almacen'
import { SIN_ESPACIO, guardarMeta, imagenesDeCategorias as imagenesLocales, leerMeta } from './categoriasMeta'
import { CLAVE_CATEGORIAS, getCategoriasTodas } from './librosService'
import { categoriasCargadas, crearCategoriaApi, quitarImagenCategoriaApi, subirImagenCategoriaApi, urlImagenCategoria } from '../api/categoriasApi'
import { dataUrlAFile } from '../utils/adaptadores'
import { norm } from '../utils/format'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'

// Categorías con foto, baja lógica y edición.
// Con el back: GET/POST /categorias y la imagen real en /categorias/{id}/imagen (subir, reemplazar, quitar).
// Lo que el back todavía no tiene (baja lógica y renombrar) se simula acá, en el navegador.
// Modo demo: la imagen también se guarda en el navegador (base64).
// Meta guardada por nombre: { [nombre]: { imagen: dataUrl|'' (solo demo), activa: boolean } }
const limpiar = (n) => n.trim().replace(/\s+/g, ' ')

// Imagen de cada categoría por nombre: { [nombre]: src }. Con el back es la URL de /categorias/{id}/imagen (si falla, el componente
// muestra la inicial); en demo, la foto guardada en el navegador.
export const imagenesDeCategorias = () => {
  if (!USAR_API) return imagenesLocales()
  return Object.fromEntries(categoriasCargadas().filter((c) => c.tieneImagen).map((c) => [c.nombre, urlImagenCategoria(c.id)]))
}

// Todas (activas e inactivas), para el panel: [{ nombre, imagen, activa }]
export const listarCategoriasAdmin = async () => {
  const meta = leerMeta()
  const todas = await getCategoriasTodas()
  const urls = imagenesDeCategorias()
  return todas.map((nombre) => ({
    nombre, imagen: USAR_API ? urls[nombre] || '' : meta[nombre]?.imagen || '', activa: meta[nombre]?.activa !== false,
  }))
}

const existe = async (nombre, excepto = '') =>
  (await getCategoriasTodas()).some((c) => c !== excepto && norm(c) === norm(nombre))

const esFotoNueva = (imagen) => typeof imagen === 'string' && imagen.startsWith('data:')
const errorApi = (err) => new Error(mensajeError(err, 'registro'))

export const crearCategoriaConFoto = async ({ nombre, imagen = '' }) => {
  const limpio = limpiar(nombre)
  if (await existe(limpio)) throw new Error('Esa categoría ya existe.')
  if (USAR_API) {
    let creada
    try { creada = await crearCategoriaApi(limpio) } catch (err) { throw errorApi(err) } // 400 si el back la ve repetida
    if (esFotoNueva(imagen)) {
      try { await subirImagenCategoriaApi(creada.id, await dataUrlAFile(imagen, 'categoria')) } catch (err) {
        throw new Error(`La categoría se creó, pero no pudimos subir la imagen: ${errorApi(err).message} Editala para volver a intentarlo.`)
      }
    }
    return
  }
  if (!guardar(CLAVE_CATEGORIAS, [...(await getCategoriasTodas()), limpio])) throw new Error(SIN_ESPACIO)
  if (imagen) guardarMeta({ ...leerMeta(), [limpio]: { imagen, activa: true } })
}

// Cambia nombre y/o foto. Renombrar solo existe en el modo demo: el back todavía no tiene PUT /categorias/{id}.
export const editarCategoria = async (actual, { nombre, imagen }) => {
  const limpio = limpiar(nombre)
  if (await existe(limpio, actual)) throw new Error('Ya hay otra categoría con ese nombre.')
  const meta = leerMeta()
  const previo = meta[actual] || { activa: true }
  if (limpio !== actual) {
    if (USAR_API) throw new Error('El nombre no se puede cambiar todavía: el servidor aún no permite editar categorías. Podés cambiar la foto.')
    const lista = (await getCategoriasTodas()).map((c) => (c === actual ? limpio : c))
    if (!guardar(CLAVE_CATEGORIAS, lista)) throw new Error(SIN_ESPACIO)
    delete meta[actual]
  }
  if (USAR_API) {
    const cat = categoriasCargadas().find((c) => c.nombre === actual)
    try {
      if (cat && esFotoNueva(imagen)) await subirImagenCategoriaApi(cat.id, await dataUrlAFile(imagen, 'categoria'))
      else if (cat && !imagen && cat.tieneImagen) await quitarImagenCategoriaApi(cat.id)
    } catch (err) { throw errorApi(err) }
    return // en el back la foto vive en el servidor: no se guarda copia en el navegador
  }
  guardarMeta({ ...meta, [limpio]: { ...previo, imagen: imagen || '' } })
}

// Baja lógica (no se borra: se puede reactivar, igual que los libros)
export const cambiarEstadoCategoria = async (nombre, activa) => {
  const meta = leerMeta()
  guardarMeta({ ...meta, [nombre]: { imagen: meta[nombre]?.imagen || '', activa } })
}
