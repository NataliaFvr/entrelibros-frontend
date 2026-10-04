import { useEffect, useMemo, useState } from 'react'
import { getResenias } from '../services/librosService'
import { getOpiniones } from '../services/opinionesService'
import { getResenasVendedor } from '../services/resenasVendedorService'

const promedio = (lista) => (lista.length ? lista.reduce((a, r) => a + r.st, 0) / lista.length : 0)

// Todo lo que le calificaron a un vendedor: su atención (reseñas al vendedor) y sus libros (opiniones de cada libro).
// Los ejemplares usados no tienen opiniones de la obra, así que solo cuentan los libros nuevos.
// Back: GET /vendedores/{id}/resenias (ResenaVendedorController) y GET /libros/{id}/resenias (ResenaLibroController).
const useCalificacionesRecibidas = (tienda, publicaciones) => {
  const atencion = useMemo(() => getResenasVendedor(tienda), [tienda])
  const nuevos = useMemo(() => publicaciones.filter((p) => !p.usado), [publicaciones])
  const [delLibro, setDelLibro] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true
    Promise.all(nuevos.map((p) => getResenias(p.id).then((base) =>
      [...getOpiniones(p.id), ...base].map((r) => ({ ...r, libro: p.t, clave: `${p.id}-${r.u}-${r.i}` })))))
      .then((listas) => { if (vigente) setDelLibro(listas.flat().sort((a, b) => a.i - b.i)) })
      .catch(() => { if (vigente) setDelLibro([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [nuevos])

  const todas = [...atencion, ...delLibro]
  return {
    cargando,
    atencion: { resenias: atencion, promedio: promedio(atencion) },
    libros: { resenias: delLibro, promedio: promedio(delLibro) },
    global: { cantidad: todas.length, promedio: promedio(todas) },
  }
}

export default useCalificacionesRecibidas
