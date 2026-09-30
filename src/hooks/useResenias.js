import { useEffect, useMemo, useState } from 'react'
import { getResenias } from '../services/librosService'
import { agregarOpinion, getOpiniones } from '../services/opinionesService'

// Reseñas de un libro (las nuevas primero) + promedio + función para publicar una
const useResenias = (libroId) => {
  const [base, setBase] = useState([])
  const [propias, setPropias] = useState(() => getOpiniones(libroId))

  useEffect(() => {
    let vigente = true
    getResenias(libroId).then((r) => { if (vigente) setBase(r) })
    return () => { vigente = false }
  }, [libroId])

  const resenias = useMemo(() => [...propias, ...base], [propias, base])
  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )

  const publicar = (opinion) => {
    agregarOpinion(libroId, opinion)
    setPropias(getOpiniones(libroId))
  }

  return { resenias, promedio, publicar }
}

export default useResenias
