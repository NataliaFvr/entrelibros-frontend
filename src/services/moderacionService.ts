import api from '../api/axiosConfig'
import { normalizarError } from '../utils/errorApi'
import type {
  AccionModeracionRequest,
  ErrorApiNormalizado,
  LibroResponse,
  ModeracionPendientesResponse,
  ModificarLibroRequest,
} from '../types/moderacion'

// Cliente de moderación. Usa el axios compartido (api/axiosConfig): ya manda el JWT y cierra la sesión si vence.
// Las rutas son relativas a su baseURL (hoy termina en /api/v1): si el back expone estos endpoints en /api/...
// sin versión, se cambian acá o en VITE_API_URL, sin tocar el resto del código.
const RUTAS = {
  libro: (id: number) => `/libros/${id}`,
  pendientes: '/admin/moderacion/pendientes',
  accion: (id: number) => `/admin/moderacion/${id}/accion`,
} as const

const CONTEXTO = 'moderacion'
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

/** PUT /libros/{id} — el libro vuelve a moderación (estadoModeracion: "PENDIENTE"). */
export async function modificarLibro(id: number, datos: ModificarLibroRequest): Promise<LibroResponse> {
  try {
    const { data } = await api.put<LibroResponse>(RUTAS.libro(id), datos)
    return data
  } catch (err) {
    return fallar(err)
  }
}

/** GET /admin/moderacion/pendientes */
export async function obtenerPendientes(): Promise<ModeracionPendientesResponse> {
  try {
    const { data } = await api.get<ModeracionPendientesResponse>(RUTAS.pendientes)
    return data
  } catch (err) {
    return fallar(err)
  }
}

/** POST /admin/moderacion/{id}/accion — aprobar o rechazar una solicitud. */
export async function resolverModeracion(id: number, accion: AccionModeracionRequest): Promise<void> {
  const motivo = accion.motivoRechazo?.trim() ?? ''
  if (!accion.aprobado && motivo.length < MIN_MOTIVO) {
    const mensaje = 'Explicale al vendedor por qué rechazás el libro.'
    throw new ModeracionError({ tipo: 'VALIDACION', status: 0, mensaje, campos: { motivoRechazo: mensaje } })
  }
  const body: AccionModeracionRequest = accion.aprobado ? { aprobado: true } : { aprobado: false, motivoRechazo: motivo }
  try {
    await api.post(RUTAS.accion(id), body)
  } catch (err) {
    fallar(err)
  }
}

export const aprobarSolicitud = (id: number) => resolverModeracion(id, { aprobado: true })
export const rechazarSolicitud = (id: number, motivoRechazo: string) => resolverModeracion(id, { aprobado: false, motivoRechazo })
