import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { getResenias } from '../api/librosApiExtra'
import { crearResenaLibroApi, eliminarResenaLibroApi, getEstadoResenaLibroApi, modificarResenaLibroApi } from '../api/resenasApi'
import { mensajeError } from '../utils/errorApi'

// Reseñas de un libro. El backend informa si la sesión actual puede publicar,
// cuál es su reseña y el ítem de compra que corresponde usar.
const useResenias = (libroId) => {
  const { user } = useAuth()
  const [base, setBase] = useState([])
  const [estado, setEstado] = useState({ puedeResenar: false, motivo: '', idOrdenItem: null, miResenia: null })

  useEffect(() => {
    let vigente = true
    getResenias(libroId).then((r) => { if (vigente) setBase(r) }).catch(() => { if (vigente) setBase([]) })
    return () => { vigente = false }
  }, [libroId])

  useEffect(() => {
    if (!user) {
      setEstado({ puedeResenar: false, motivo: 'Iniciá sesión para dejar una opinión.', idOrdenItem: null, miResenia: null })
      return undefined
    }
    let vigente = true
    getEstadoResenaLibroApi(libroId).then((r) => { if (vigente) setEstado(r) }).catch(() => {
      if (vigente) setEstado({ puedeResenar: false, motivo: '', idOrdenItem: null, miResenia: null })
    })
    return () => { vigente = false }
  }, [libroId, user])

  const resenias = base
  const miResenia = estado.miResenia
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const publicar = async (opinion) => {
    try {
      if (miResenia) {
        await modificarResenaLibroApi(miResenia.id, { calificacion: opinion.st, comentario: opinion.t })
      } else {
        await crearResenaLibroApi({ idOrdenItem: estado.idOrdenItem, calificacion: opinion.st, comentario: opinion.t })
      }
      setBase(await getResenias(libroId))
      if (user) setEstado(await getEstadoResenaLibroApi(libroId))
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  // Sin id borra la propia; el admin pasa el id de cualquier reseña
  const eliminar = async (id = miResenia?.id) => {
    if (!id) return
    try {
      await eliminarResenaLibroApi(id)
      setBase(await getResenias(libroId))
    } catch (err) {
      throw new Error(mensajeError(err))
    }
  }

  return { resenias, promedio, miResenia, puedeResenar: estado.puedeResenar, motivo: estado.motivo, publicar, eliminar }
}

export default useResenias
