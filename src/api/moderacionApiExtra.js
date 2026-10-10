import api, { RAIZ } from './axiosConfig'
import { esListaVacia, normalizarError } from '../utils/errorApi'

const RUTAS = {
  libro: (id) => `/libros/${id}`,
  moderar: (id) => `/libros/${id}/moderacion`,
  porEstado: '/libros/moderacion',
  historial: '/libros/historial-moderacion',
  historialLibro: (id) => `/libros/${id}/historial-moderacion`,
}

const CONTEXTO = 'libro'
const MIN_MOTIVO = 3

export class ModeracionError extends Error {
  constructor(error) {
    super(error.mensaje)
    this.name = 'ModeracionError'
    this.tipo = error.tipo
    this.status = error.status
    this.campos = error.campos
  }
}

export const esModeracionError = (e) => e instanceof ModeracionError

const fallar = (err) => {
  if (err instanceof ModeracionError) throw err
  throw new ModeracionError(normalizarError(err, CONTEXTO))
}

const paginaVacia = (size, number) => ({
  content: [], totalElements: 0, totalPages: 0, number, size, first: true, last: true, empty: true,
})

export async function modificarLibro(id, datos) {
  try {
    const { data } = await api.patch(RUTAS.libro(id), datos, { baseURL: RAIZ })
    return data
  } catch (err) {
    return fallar(err)
  }
}

// El back responde 404 cuando no hay libros en ese estado: acá eso es una página vacía.
export async function obtenerLibrosPorEstado(estado, page = 0, size = 20) {
  try {
    const { data } = await api.get(RUTAS.porEstado, { baseURL: RAIZ, params: { estado, page, size } })
    return data
  } catch (err) {
    if (esListaVacia(err)) return paginaVacia(size, page)
    return fallar(err)
  }
}

export const obtenerPendientes = (page = 0, size = 20) => obtenerLibrosPorEstado('EN_REVISION', page, size)

export async function moderarLibro(id, decision) {
  const comentario = decision.comentario?.trim() ?? ''
  if (decision.estadoModeracion === 'RECHAZADO' && comentario.length < MIN_MOTIVO) {
    const mensaje = 'Explicale al vendedor por qué rechazás el libro.'
    throw new ModeracionError({ tipo: 'VALIDACION', status: 0, mensaje, campos: { comentario: mensaje } })
  }
  const body = comentario ? { ...decision, comentario } : { estadoModeracion: decision.estadoModeracion }
  try {
    const { data } = await api.patch(RUTAS.moderar(id), body, { baseURL: RAIZ })
    return data
  } catch (err) {
    return fallar(err)
  }
}

export const aprobarLibro = (id, comentario) => moderarLibro(id, { estadoModeracion: 'ACEPTADO', comentario })
export const rechazarLibro = (id, comentario) => moderarLibro(id, { estadoModeracion: 'RECHAZADO', comentario })

export async function obtenerHistorial(page = 0, size = 20) {
  try {
    const { data } = await api.get(RUTAS.historial, { baseURL: RAIZ, params: { page, size } })
    return data
  } catch (err) {
    return fallar(err)
  }
}

export async function obtenerHistorialDeLibro(id, page = 0, size = 20) {
  try {
    const { data } = await api.get(RUTAS.historialLibro(id), { baseURL: RAIZ, params: { page, size } })
    return data
  } catch (err) {
    return fallar(err)
  }
}

const aDatos = (l) => ({
  titulo: l.titulo, autor: l.autor, editorial: l.editorial, anio: l.anio, idioma: l.idioma, estadoLibro: l.estadoLibro,
  precio: l.precio, descuentoPct: l.descuentoPct, stock: l.stock, descripcion: l.descripcion,
})

const aDatosAnteriores = (l) => (l.snapshotTitulo == null ? null : {
  titulo: l.snapshotTitulo, autor: l.snapshotAutor, editorial: l.snapshotEditorial, anio: l.snapshotAnio,
  idioma: l.snapshotIdioma, estadoLibro: l.snapshotEstadoLibro, precio: l.snapshotPrecio,
  descuentoPct: l.snapshotDescuentoPct, stock: l.snapshotStock, descripcion: l.snapshotDescripcion,
})

export async function obtenerSolicitudes() {
  const libros = []
  for (let page = 0; ; page++) {
    const pagina = await obtenerPendientes(page, 50)
    libros.push(...pagina.content)
    if (pagina.last || pagina.empty) break
  }
  return libros.map((l) => {
    const datosActuales = aDatosAnteriores(l)
    return {
      id: l.id, tipoModeracion: datosActuales ? 'MODIFICACION' : 'NUEVO', fechaSolicitud: l.fechaSolicitudRevision || null,
      libroId: l.id, nombreVendedor: l.nombreVendedor, datosActuales, datosPropuestos: aDatos(l),
    }
  })
}

export async function moderarSolicitud(id, accion) {
  await (accion.aprobado ? aprobarLibro(id) : rechazarLibro(id, accion.motivoRechazo ?? ''))
}
