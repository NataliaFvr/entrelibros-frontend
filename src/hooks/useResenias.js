import { useEffect, useMemo, useState } from 'react'
import { getResenias } from '../services/librosService'

// Reseñas de un libro + promedio
const useResenias = (libroId) => {
  const [resenias, setResenias] = useState([])

  useEffect(() => {
    let vigente = true
    getResenias(libroId).then((r) => { if (vigente) setResenias(r) })
    return () => { vigente = false }
  }, [libroId])

  const promedio = useMemo(
    () => (resenias.length ? resenias.reduce((a, r) => a + r.st, 0) / resenias.length : 0),
    [resenias],
  )
  return { resenias, promedio }
}

export default useResenias
