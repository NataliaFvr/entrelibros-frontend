// Un libro es usado si viene marcado como `usado` (mock/servicios) o `esUsado` (back).
// Centralizado para que ninguna vista tenga que adivinar cuál de los dos campos llega.
export const esUsado = (libro) => Boolean(libro && (libro.usado || libro.esUsado))

// Descripción del libro ya limpia, o '' si no tiene (null, undefined, vacía o solo espacios)
export const descripcionDe = (libro) => (typeof libro?.descripcion === 'string' ? libro.descripcion.trim() : '')
