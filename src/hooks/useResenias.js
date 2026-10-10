import { useEffect, useMemo, useState } from 'react'
import { useCompra } from './useCompra'
import { useAuth } from './useAuth'
import { getResenias } from '../api/librosApiExtra'
import { crearResenaLibroApi, eliminarResenaLibroApi, modificarResenaLibroApi } from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'

// Reseñas de un libro (las nuevas primero). La propia se identifica por idComprador para editarla o eliminarla.
const useResenias = (libroId) => {
  const { itemPagado } = useCompra()
  const { user } = useAuth()
  const [base, setBase] = useState([])

  useEffect(() => {
    let vigente = true
    getResenias(libroId).then((r) => { if (vigente) setBase(r) }).catch(() => { if (vigente) setBase([]) })
    return () => { vigente = false }
  }, [libroId])

  const resenias = base
  const miResenia = user ? resenias.find((r) => r.idComprador === user.id) || null : null
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const publicar = async (opinion) => {
    try {
      if (miResenia) {
        await modificarResenaLibroApi(miResenia.id, { calificacion: opinion.st, comentario: opinion.t })
      } else {
        const compra = itemPagado(libroId)
        if (!compra) throw new Error('Solo podés opinar sobre libros que compraste y pagaste.')
        await crearResenaLibroApi({ idOrdenItem: compra.idItem, calificacion: opinion.st, comentario: opinion.t })
      }
      setBase(await getResenias(libroId))
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  const eliminar = async () => {
    if (!miResenia) return
    try {
      await eliminarResenaLibroApi(miResenia.id)
      setBase(await getResenias(libroId))
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  return { resenias, promedio, miResenia, publicar, eliminar }
}

export default useResenias
