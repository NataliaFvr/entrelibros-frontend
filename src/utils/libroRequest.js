// Puente entre el formulario de libro y LibroRequest del back. Si algún nombre del back es distinto,
// se ajusta SOLO acá.

// Datos del formulario (t, a, ed, ...) -> cuerpo del POST /libros o PUT /libros/{id}
export const aLibroRequest = (d) => ({
  titulo: d.t,
  autor: d.a,
  editorial: d.ed,
  categoria: d.cat,
  idioma: d.idioma,
  anioPublicacion: d.anio, // Integer
  estadoLibro: d.usado ? 'USADO' : 'NUEVO',
  precio: d.base, // BigDecimal (hasta 2 decimales)
  descuento: d.d, // Integer 0..100
  stock: d.stock,
  descripcion: d.descripcion,
})

// Campo de LibroRequest -> campo del formulario (para pintar los errores que devuelve la API en cada input)
export const CAMPOS_LIBRO = {
  titulo: 't', autor: 'a', editorial: 'ed', categoria: 'cat', idioma: 'idioma',
  anioPublicacion: 'anio', estadoLibro: 'estado', precio: 'base', descuento: 'd',
  stock: 'stock', descripcion: 'descripcion',
}
