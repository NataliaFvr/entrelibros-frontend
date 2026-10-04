// Tipos del módulo de moderación de libros. Reflejan los JSON del back (Spring Boot), campo por campo.

/** Datos editables de un libro (cuerpo de PUT /libros/{id} y contenido de datosActuales / datosPropuestos). */
export interface DatosLibro {
  titulo: string
  precio: number
  descripcion: string
  imagenUrl: string
}

/**
 * Estado de moderación que devuelve el back. Solo "PENDIENTE" está confirmado hoy;
 * el resto de los valores se acepta como string hasta que el back los defina.
 */
export type EstadoModeracion = 'PENDIENTE' | (string & {})

/** NUEVO = libro recién publicado; MODIFICACION = edición de un libro ya publicado. */
export type TipoModeracion = 'NUEVO' | 'MODIFICACION'

/** PUT /libros/{id} — cuerpo enviado. */
export type ModificarLibroRequest = DatosLibro

/** PUT /libros/{id} — respuesta. */
export interface LibroResponse extends DatosLibro {
  id: number
  estadoModeracion: EstadoModeracion
}

/** Un elemento de GET /admin/moderacion/pendientes. */
export interface SolicitudModeracion {
  id: number
  tipoModeracion: TipoModeracion
  /** Fecha ISO sin zona, ej. "2026-10-04T12:00:00". */
  fechaSolicitud: string
  libroId: number
  datosActuales: DatosLibro
  datosPropuestos: DatosLibro
}

/** GET /admin/moderacion/pendientes — respuesta. */
export type ModeracionPendientesResponse = SolicitudModeracion[]

/** POST /admin/moderacion/{id}/accion — cuerpo enviado. */
export interface AccionModeracionRequest {
  aprobado: boolean
  /** Se envía al rechazar (el front exige un motivo, como en el panel de administración). */
  motivoRechazo?: string
}

/** Error ya normalizado por utils/errorApi.js (normalizarError). */
export interface ErrorApiNormalizado {
  tipo: string
  status: number
  mensaje: string
  campos: Record<string, string>
}
