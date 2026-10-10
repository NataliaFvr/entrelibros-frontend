import { useEffect, useState } from 'react'
import { getOpinionesVendedor } from '../api/opinionesApi'
import { getResenasVendedorApi } from '../api/resenasApi'

const promedio = (lista) => (lista.length ? lista.reduce((a, r) => a + r.st, 0) / lista.length : 0)

// Todo lo que le calificaron a un vendedor: su atención (reseñas al vendedor) y sus libros (opiniones de lo que vendió).
// GET /resenas-vendedor/vendedor/{idVendedor} y GET /resenas-libro/vendedor/{idVendedor}/opiniones-libros.
const useCalificacionesRecibidas = (_tienda, _publicaciones, idVendedor = null) => {
  const [delBack, setDelBack] = useState([])
  const [delLibro, setDelLibro] = useState([])
  const [cargando, setCargando] = useState(true)
  const atencion = delBack

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    getResenasVendedorApi(idVendedor).then((r) => { if (vigente) setDelBack(r) }).catch(() => {})
    return () => { vigente = false }
  }, [idVendedor])

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    getOpinionesVendedor(idVendedor)
      .then((lista) => { if (vigente) setDelLibro(lista) })
      .catch(() => { if (vigente) setDelLibro([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor])

  return {
    cargando,
    atencion: { resenias: atencion, promedio: promedio(atencion) },
    libros: { resenias: delLibro, promedio: promedio(delLibro) },
  }
}

export default useCalificacionesRecibidas
