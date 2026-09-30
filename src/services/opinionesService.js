import { guardar, leer } from './almacen'

// Opiniones que dejó la gente sobre cada libro, guardadas en este navegador ({ [idLibro]: [...] }).
// Back: POST /libros/{id}/resenias (solo quien compró el libro)
const CLAVE = 'entrelibros_opiniones'

export const getOpiniones = (idLibro) => leer(CLAVE, {})[idLibro] || []

export const agregarOpinion = (idLibro, opinion) => {
  const todas = leer(CLAVE, {})
  todas[idLibro] = [opinion, ...(todas[idLibro] || [])]
  guardar(CLAVE, todas)
}
