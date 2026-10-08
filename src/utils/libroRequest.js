// Puente entre el formulario de libro y LibroRequest del back (POST /libros, PATCH /libros/{id}).
// Los nombres salen de LibroRequest.java. Si el back cambia alguno, se ajusta SOLO acá.

// Datos del formulario (t, a, ed, ...) -> cuerpo de la petición.
// `idCategorias` (opcional, lista de ids): el back guarda categorías por id; si no se pasa, no se envía
// y el back conserva las que ya tenía el libro.
export const aLibroRequest = (d, idCategorias) => ({
  titulo: d.t,
  autor: d.a,
  editorial: d.ed,
  anio: d.anio, // Integer
  idioma: d.idioma,
  estadoLibro: d.usado ? 'USADO' : 'NUEVO', // enum EstadoLibro del back
  precio: d.base, // Double
  descuentoPct: d.d, // Double, 0..100
  stock: d.stock,
  descripcion: d.descripcion,
  ...(Array.isArray(idCategorias) ? { idCategorias } : {}),
})

// Campo de LibroRequest -> campo del formulario (para pintar los errores que devuelve la API en cada input)
export const CAMPOS_LIBRO = {
  titulo: 't', autor: 'a', editorial: 'ed', idCategorias: 'cats', idioma: 'idioma',
  anio: 'anio', estadoLibro: 'estado', precio: 'base', descuentoPct: 'd',
  stock: 'stock', descripcion: 'descripcion',
}
