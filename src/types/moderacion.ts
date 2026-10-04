// Tipos del módulo de moderación de libros. Reflejan los DTOs REALES del back (Spring Boot), campo por campo:
// LibroRequest, LibroResponse, ModeracionRequest, HistorialModeracionResponse y EstadoModeracion.

/** EstadoModeracion del back (enum). Un libro nuevo nace EN_REVISION; solo el ADMIN lo pasa a ACEPTADO o RECHAZADO. */
export type EstadoModeracion = 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO'

/** EstadoLibro del back (enum, se compara con valueOf: va en mayúsculas). */
export type EstadoLibro = 'NUEVO' | 'USADO'

/** EstadoPublicacion del back (enum). */
export type EstadoPublicacion = 'ACTIVA' | 'DADA_DE_BAJA'

/**
 * PATCH /libros/{id} — cuerpo (LibroRequest). El back aplica SOLO los campos que vienen (setIfPresent):
 * lo que se omite no se toca. `idCategorias` reemplaza las categorías si se envía.
 */
export interface ModificarLibroRequest {
  titulo?: string
  autor?: string
  editorial?: string
  anio?: number
  idioma?: string
  estadoLibro?: EstadoLibro
  precio?: number
  descuentoPct?: number
  stock?: number
  descripcion?: string
  idCategorias?: number[]
}

/** Respuesta de /libros (LibroResponse). Los campos pueden venir null si el libro no los tiene cargados. */
export interface LibroResponse {
  id: number
  titulo: string
  autor: string | null
  editorial: string | null
  anio: number | null
  idioma: string | null
  estadoLibro: EstadoLibro | null
  precio: number | null
  descuentoPct: number | null
  stock: number | null
  descripcion: string | null
  estadoPublicacion: EstadoPublicacion | null
  estadoModeracion: EstadoModeracion | null
  idVendedor: number | null
  nombreVendedor: string | null
}

/** Página de Spring Data (Page<T>): lo que devuelven los listados paginados. */
export interface Pagina<T> {
  content: T[]
  totalElements: number
  totalPages: number
  /** Número de página, desde 0. */
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

/** PATCH /libros/{id}/moderacion — cuerpo (ModeracionRequest). Solo ADMIN. */
export interface ModeracionRequest {
  estadoModeracion: EstadoModeracion
  /** Motivo o nota de la decisión; queda en el historial. El front lo exige al rechazar. */
  comentario?: string
}

/** Un registro de GET /libros/historial-moderacion y /libros/{id}/historial-moderacion (HistorialModeracionResponse). */
export interface HistorialModeracion {
  id: number
  idLibro: number
  tituloLibro: string
  idModerador: number
  nombreModerador: string
  estadoAnterior: EstadoModeracion | null
  estadoNuevo: EstadoModeracion
  comentario: string | null
  /** Fecha ISO sin zona, ej. "2026-10-04T12:00:00". */
  fecha: string
}

/** Error ya normalizado por utils/errorApi.js (normalizarError). */
export interface ErrorApiNormalizado {
  tipo: string
  status: number
  mensaje: string
  campos: Record<string, string>
}
