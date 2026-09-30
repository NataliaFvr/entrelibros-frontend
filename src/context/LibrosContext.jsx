import { useEffect, useMemo, useState } from 'react'
import { getCategorias, getLibros } from '../services/librosService'
import { LibrosCtx } from './librosCtx'

const LibrosProvider = ({ children }) => {
  const [libros, setLibros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([getLibros(), getCategorias()])
      .then(([l, c]) => { setLibros(l); setCategorias(c) })
      .finally(() => setCargando(false))
  }, [])

  // Vuelve a leer el catálogo (por ejemplo, cuando un vendedor publica o da de baja un libro)
  const recargar = () => getLibros().then(setLibros)

  const value = useMemo(() => ({ libros, categorias, cargando, recargar }), [libros, categorias, cargando])
  return <LibrosCtx.Provider value={value}>{children}</LibrosCtx.Provider>
}

export default LibrosProvider
