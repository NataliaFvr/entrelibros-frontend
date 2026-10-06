import { guardar } from './almacen'
import { SIN_ESPACIO, guardarMeta, leerMeta } from './categoriasMeta'
import { CLAVE_CATEGORIAS, getCategoriasTodas } from './librosService'
import { crearCategoriaApi } from '../api/categoriasApi'
import { norm } from '../utils/format'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'

// Categorías con foto, baja lógica y edición.
// El back solo tiene GET /categorias y POST /categorias {nombre}. Lo demás (imagen, soft delete, renombrar) se simula acá, en el navegador,
// con la misma forma que usarían los libros (activa/baja + imagen), para que el día que el back lo tenga solo cambie esta capa.
// Meta guardada por nombre: { [nombre]: { imagen: dataUrl|'', activa: boolean } }
const limpiar = (n) => n.trim().replace(/\s+/g, ' ')

// Todas (activas e inactivas), para el panel: [{ nombre, imagen, activa }]
export const listarCategoriasAdmin = async () => {
  const meta = leerMeta()
  return (await getCategoriasTodas()).map((nombre) => ({ nombre, imagen: meta[nombre]?.imagen || '', activa: meta[nombre]?.activa !== false }))
}

const existe = async (nombre, excepto = '') =>
  (await getCategoriasTodas()).some((c) => c !== excepto && norm(c) === norm(nombre))

export const crearCategoriaConFoto = async ({ nombre, imagen = '' }) => {
  const limpio = limpiar(nombre)
  if (await existe(limpio)) throw new Error('Esa categoría ya existe.')
  if (USAR_API) {
    try { await crearCategoriaApi(limpio) } catch (err) { throw new Error(mensajeError(err, 'registro')) } // 400 si el back la ve repetida
  } else if (!guardar(CLAVE_CATEGORIAS, [...(await getCategoriasTodas()), limpio])) throw new Error(SIN_ESPACIO)
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
  guardarMeta({ ...meta, [limpio]: { ...previo, imagen: imagen || '' } })
}

// Baja lógica (no se borra: se puede reactivar, igual que los libros)
export const cambiarEstadoCategoria = async (nombre, activa) => {
  const meta = leerMeta()
  guardarMeta({ ...meta, [nombre]: { imagen: meta[nombre]?.imagen || '', activa } })
}
