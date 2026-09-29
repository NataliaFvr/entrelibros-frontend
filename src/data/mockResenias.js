const USUARIOS = ['Camila R.', 'Martín P.', 'Sofía L.', 'Diego F.', 'Valentina S.', 'Lucas M.', 'Julieta B.', 'Ramiro C.']
const POSITIVAS = ['Lo terminé en dos días, no pude soltarlo.', 'Llegó en perfecto estado y bien embalado.', 'Muy buena edición, el papel es de calidad.', 'Una historia que te deja pensando varios días.', 'Excelente relación precio-calidad.']
const MEDIAS = ['Está bien, aunque esperaba más del final.', 'Buena historia, pero el ritmo decae en el medio.']
const BAJAS = ['La tapa llegó con un golpe.', 'No era lo que esperaba.']
const CUANDO = ['Hace 3 días', 'Hace 2 semanas', 'Hace 1 mes', 'Hace 2 meses', 'Hace 4 meses', 'Hace 8 meses']

// Reseñas de ejemplo, deterministas por libro (en producción: GET /libros/{id}/resenias)
export function generarResenias(libroId) {
  let s = libroId * 97 + 13
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  const n = 6 + (libroId % 17)
  return Array.from({ length: n }, (_, i) => {
    const x = r()
    const st = x < 0.68 ? 5 : x < 0.86 ? 4 : x < 0.94 ? 3 : x < 0.98 ? 2 : 1
    const textos = st >= 4 ? POSITIVAS : st === 3 ? MEDIAS : BAJAS
    return { st, i, u: USUARIOS[Math.floor(r() * USUARIOS.length)], t: textos[Math.floor(r() * textos.length)], w: CUANDO[Math.floor((i * 6) / n)] }
  })
}
