import { useEffect, useMemo, useState } from 'react'
import { getOpinionesVendedor } from '../services/opinionesService'
import { getResenasVendedor } from '../services/resenasVendedorService'

const promedio = (lista) => (lista.length ? lista.reduce((a, r) => a + r.st, 0) / lista.length : 0)

// Todo lo que le calificaron a un vendedor: su atención (reseñas al vendedor) y sus libros (opiniones de lo que vendió).
// Las opiniones de libros ya no se generan al azar por publicación: son las reales de este navegador + las de ejemplo del vendedor de prueba.
// Back: GET /vendedores/{id}/resenias (ResenaVendedorController) y GET /vendedores/{id}/opiniones-libros.
const useCalificacionesRecibidas = (tienda, publicaciones) => {
  const atencion = useMemo(() => getResenasVendedor(tienda), [tienda])
  const [delLibro, setDelLibro] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true
    getOpinionesVendedor(tienda, publicaciones)
      .then((lista) => { if (vigente) setDelLibro(lista) })
      .catch(() => { if (vigente) setDelLibro([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [tienda, publicaciones])

  return {
    cargando,
    atencion: { resenias: atencion, promedio: promedio(atencion) },
    libros: { resenias: delLibro, promedio: promedio(delLibro) },
  }
}

export default useCalificacionesRecibidas
