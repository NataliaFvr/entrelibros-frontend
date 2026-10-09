import { useEffect, useMemo, useState } from 'react'
import { useCompra } from './useCompra'
<<<<<<< HEAD
import { getResenias } from '../services/librosService'
=======
import { getResenias } from '../api/librosApiExtra'
>>>>>>> 726f86e (Union)
import { crearResenaLibroApi } from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'

// Reseñas de un libro (las nuevas primero) + promedio + función para publicar una.
// Con el back: GET /resenas-libro/libro/{id} y POST /resenas-libro { idOrdenItem, calificacion, comentario }
// (solo quien compró y pagó ese ítem; una sola reseña por ítem). `publicar` lanza un Error con el mensaje del back si falla.
const useResenias = (libroId) => {
  const { itemPagado } = useCompra()
  const [base, setBase] = useState([])
  const [propias] = useState([])

  useEffect(() => {
    let vigente = true
    getResenias(libroId).then((r) => { if (vigente) setBase(r) }).catch(() => { if (vigente) setBase([]) })
    return () => { vigente = false }
  }, [libroId])

  const resenias = useMemo(() => [...propias, ...base], [propias, base])
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const publicar = async (opinion) => {
    const compra = itemPagado(libroId)
    if (!compra) throw new Error('Solo podés opinar sobre libros que compraste y pagaste.')
    try {
      await crearResenaLibroApi({ idOrdenItem: compra.idItem, calificacion: opinion.st, comentario: opinion.t })
      setBase(await getResenias(libroId))
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  return { resenias, promedio, publicar }
}

export default useResenias
