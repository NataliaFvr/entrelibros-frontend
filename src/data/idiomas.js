// Catálogo estandarizado de idiomas para publicar un libro (reemplaza el texto libre).
// Back: si LibroRequest valida el idioma contra una lista, debe ser la misma (o pedirla con GET /idiomas).
export const IDIOMAS = [
  'Español', 'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano',
  'Catalán', 'Japonés', 'Chino', 'Ruso', 'Árabe', 'Otro',
]

export const IDIOMA_POR_DEFECTO = 'Español'

// Si un libro viejo trae un idioma que no está en el catálogo, se suma para no perderlo al editar
export const opcionesIdioma = (actual) => (!actual || IDIOMAS.includes(actual) ? IDIOMAS : [actual, ...IDIOMAS])
