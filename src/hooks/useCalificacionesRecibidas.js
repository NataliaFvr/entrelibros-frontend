import { useEffect } from 'react'
import { fetchOpinionesVendedor, fetchResenasVendedor } from '../redux/resenasSlice'

const promedio = (lista) => (lista.length ? lista.reduce((a, r) => a + r.st, 0) / lista.length : 0)

// Lo que le calificaron a un vendedor: su atención (reseñas al vendedor) y sus libros (opiniones de lo que vendió)
const useCalificacionesRecibidas = (_tienda, _publicaciones, idVendedor = null, { dispatch, atencion, delLibro }) => {

  useEffect(() => {
    if (idVendedor != null && atencion === undefined) dispatch(fetchResenasVendedor(idVendedor))
  }, [dispatch, idVendedor, atencion])

  useEffect(() => {
    if (idVendedor != null && delLibro === undefined) dispatch(fetchOpinionesVendedor(idVendedor))
  }, [dispatch, idVendedor, delLibro])

  return {
    cargando: delLibro === undefined,
    atencion: { resenias: atencion || [], promedio: promedio(atencion || []) },
    libros: { resenias: delLibro || [], promedio: promedio(delLibro || []) },
  }
}

export default useCalificacionesRecibidas
