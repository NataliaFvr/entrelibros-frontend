import { useEffect, useState } from 'react'
import { getOpinionesVendedor } from '../services/opinionesService'
import { getResenasVendedorApi } from '../api/resenasApi'

const promedio = (lista) => (lista.length ? lista.reduce((a, r) => a + r.st, 0) / lista.length : 0)

// Todo lo que le calificaron a un vendedor: su atención (reseñas al vendedor) y sus libros (opiniones de lo que vendió).
// Con el back: GET /resenas-vendedor/vendedor/{idVendedor} y GET /resenas-libro/libro/{id} de cada una de sus publicaciones.
// Sin el back: las reales de este navegador + las de ejemplo del vendedor de prueba.
const useCalificacionesRecibidas = (tienda, publicaciones, idVendedor = null) => {
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
