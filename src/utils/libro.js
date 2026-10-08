// Un libro es usado si viene marcado como `usado` (mock/servicios) o `esUsado` (back).
// Centralizado para que ninguna vista tenga que adivinar cuál de los dos campos llega.
export const esUsado = (libro) => Boolean(libro && (libro.usado || libro.esUsado))

// Descripción del libro ya limpia, o '' si no tiene (null, undefined, vacía o solo espacios)
export const descripcionDe = (libro) => (typeof libro?.descripcion === 'string' ? libro.descripcion.trim() : '')

// Un libro puede tener varias categorías (el back guarda una lista). Regla única en todo el front:
//   - `cats`: todas. `cat`: la que se MUESTRA en tarjetas, breadcrumb y "Más de…" = la primera de `cats`.
//   - El back no guarda orden ni "principal" (LibroCategoria es solo libro+categoría): el orden es el de GET /categorias
//     (findAll), que el front aplica siempre igual (getLibrosApi y el formulario), así no cambia entre sesiones.
// Los libros de demo traen solo `cat`: se toma como lista de una.
export const categoriasDe = (libro) => {
  if (!libro) return []
  if (Array.isArray(libro.cats) && libro.cats.length) return libro.cats
  return libro.cat ? [libro.cat] : []
}
export const categoriaPrincipal = (libro) => categoriasDe(libro)[0] || ''
export const textoCategorias = (libro) => categoriasDe(libro).join(', ')
