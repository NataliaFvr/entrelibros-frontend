import api from '../api/axiosConfig'
import { normalizarError } from '../utils/errorApi'
import type {
  AccionSolicitud,
  DatosLibro,
  ErrorApiNormalizado,
  EstadoModeracion,
  HistorialModeracion,
  LibroResponse,
  ModeracionRequest,
  ModificarLibroRequest,
  Pagina,
  SolicitudModeracion,
} from '../types/moderacion'

// Cliente de libros y moderación contra el back real. Usa el axios compartido (api/axiosConfig):
// ya manda el JWT y cierra la sesión si vence.
//
// OJO con la URL: en el back solo /auth cuelga de /api/v1; los controllers de libros están en la raíz
// (@RequestMapping("libros")). Por eso acá se reemplaza la baseURL por la raíz del servidor
// (VITE_API_URL sin el sufijo /api/v1). Si el back cambia de prefijo, se ajusta RAIZ y listo.
const RAIZ = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/api\/v1\/?$/, '')

const RUTAS = {
  libro: (id: number) => `/libros/${id}`,
  moderar: (id: number) => `/libros/${id}/moderacion`,
  porEstado: '/libros/moderacion',
  historial: '/libros/historial-moderacion',
  historialLibro: (id: number) => `/libros/${id}/historial-moderacion`,
} as const

const CONTEXTO = 'libro'
const MIN_MOTIVO = 3 // mismo mínimo que pide el panel de administración al rechazar

/** Único tipo de error que lanza este servicio: la UI solo necesita mostrar `mensaje` (o `campos` en formularios). */
export class ModeracionError extends Error {
  readonly tipo: string
  readonly status: number
  readonly campos: Record<string, string>

  constructor(error: ErrorApiNormalizado) {
    super(error.mensaje)
    this.name = 'ModeracionError'
    this.tipo = error.tipo
    this.status = error.status
    this.campos = error.campos
  }
}

export const esModeracionError = (e: unknown): e is ModeracionError => e instanceof ModeracionError

// Manejo centralizado: cualquier fallo (red, timeout, 4xx, 5xx) sale como ModeracionError con mensaje en español.
const fallar = (err: unknown): never => {
  if (err instanceof ModeracionError) throw err
  throw new ModeracionError(normalizarError(err, CONTEXTO) as ErrorApiNormalizado)
}

const paginaVacia = <T>(size: number, number: number): Pagina<T> => ({
  content: [], totalElements: 0, totalPages: 0, number, size, first: true, last: true, empty: true,
})

/**
 * PATCH /libros/{id} — solo VENDEDOR dueño del libro. Devuelve el libro con su `estadoModeracion` actual:
 * la UI decide qué mostrar según ese valor (no asume que quedó EN_REVISION).
 */
export async function modificarLibro(id: number, datos: ModificarLibroRequest): Promise<LibroResponse> {
  try {
    const { data } = await api.patch<LibroResponse>(RUTAS.libro(id), datos, { baseURL: RAIZ })
    return data
  } catch (err) {
    return fallar(err)
  }
}

/**
 * GET /libros/moderacion?estado=… — solo ADMIN. EN_REVISION = cola de pendientes.
 * El back responde 404 cuando no hay libros en ese estado (ListaVaciaException): acá eso es una página vacía.
 */
export async function obtenerLibrosPorEstado(estado: EstadoModeracion, page = 0, size = 20): Promise<Pagina<LibroResponse>> {
  try {
    const { data } = await api.get<Pagina<LibroResponse>>(RUTAS.porEstado, { baseURL: RAIZ, params: { estado, page, size } })
    return data
  } catch (err) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) return paginaVacia(size, page)
    return fallar(err)
  }
}

export const obtenerPendientes = (page = 0, size = 20) => obtenerLibrosPorEstado('EN_REVISION', page, size)

/** PATCH /libros/{id}/moderacion — solo ADMIN. Aprobar = ACEPTADO, rechazar = RECHAZADO (con motivo). */
export async function moderarLibro(id: number, decision: ModeracionRequest): Promise<LibroResponse> {
  const comentario = decision.comentario?.trim() ?? ''
  if (decision.estadoModeracion === 'RECHAZADO' && comentario.length < MIN_MOTIVO) {
    const mensaje = 'Explicale al vendedor por qué rechazás el libro.'
    throw new ModeracionError({ tipo: 'VALIDACION', status: 0, mensaje, campos: { comentario: mensaje } })
  }
  const body: ModeracionRequest = comentario ? { ...decision, comentario } : { estadoModeracion: decision.estadoModeracion }
  try {
    const { data } = await api.patch<LibroResponse>(RUTAS.moderar(id), body, { baseURL: RAIZ })
    return data
  } catch (err) {
    return fallar(err)
  }
}

export const aprobarLibro = (id: number, comentario?: string) => moderarLibro(id, { estadoModeracion: 'ACEPTADO', comentario })
export const rechazarLibro = (id: number, comentario: string) => moderarLibro(id, { estadoModeracion: 'RECHAZADO', comentario })

/** GET /libros/historial-moderacion — solo ADMIN. */
export async function obtenerHistorial(page = 0, size = 20): Promise<Pagina<HistorialModeracion>> {
  try {
    const { data } = await api.get<Pagina<HistorialModeracion>>(RUTAS.historial, { baseURL: RAIZ, params: { page, size } })
    return data
  } catch (err) {
    return fallar(err)
  }
}

/** GET /libros/{id}/historial-moderacion — solo ADMIN. */
export async function obtenerHistorialDeLibro(id: number, page = 0, size = 20): Promise<Pagina<HistorialModeracion>> {
  try {
    const { data } = await api.get<Pagina<HistorialModeracion>>(RUTAS.historialLibro(id), { baseURL: RAIZ, params: { page, size } })
    return data
  } catch (err) {
    return fallar(err)
  }
}

const aDatos = (l: LibroResponse): DatosLibro => ({
  titulo: l.titulo, autor: l.autor, editorial: l.editorial, anio: l.anio, idioma: l.idioma, estadoLibro: l.estadoLibro,
  precio: l.precio, descuentoPct: l.descuentoPct, stock: l.stock, descripcion: l.descripcion,
})

/**
 * Cola del panel de moderación: todos los libros EN_REVISION (se recorren las páginas del back).
 * El back de hoy solo distingue libros nuevos: todo lo que llega es tipo NUEVO, sin versión previa que comparar.
 * Cuando el back registre modificaciones pendientes, solo cambia este adaptador.
 */
export async function obtenerSolicitudes(): Promise<SolicitudModeracion[]> {
  const solicitudes: SolicitudModeracion[] = []
  for (let page = 0; ; page++) {
    const pagina = await obtenerPendientes(page, 50)
    solicitudes.push(...pagina.content.map((l): SolicitudModeracion => ({
      id: l.id, tipoModeracion: 'NUEVO', fechaSolicitud: null, libroId: l.id, nombreVendedor: l.nombreVendedor,
      datosActuales: null, datosPropuestos: aDatos(l),
    })))
    if (pagina.last || pagina.empty) return solicitudes
  }
}

/** Aprobar (ACEPTADO) o rechazar (RECHAZADO + motivo) una solicitud. Rechazar sin motivo lanza ModeracionError. */
export async function moderarSolicitud(id: number, accion: AccionSolicitud): Promise<void> {
  await (accion.aprobado ? aprobarLibro(id) : rechazarLibro(id, accion.motivoRechazo ?? ''))
}
