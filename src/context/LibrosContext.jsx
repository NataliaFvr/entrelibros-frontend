import { useEffect, useMemo, useState } from 'react'
import { getCategorias, getLibros } from '../services/librosService'
import { LibrosCtx } from './librosCtx'

export function LibrosProvider({ children }) {
  const [libros, setLibros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([getLibros(), getCategorias()])
      .then(([l, c]) => { setLibros(l); setCategorias(c) })
      .finally(() => setCargando(false))
  }, [])

  const value = useMemo(() => ({ libros, categorias, cargando }), [libros, categorias, cargando])
  return <LibrosCtx.Provider value={value}>{children}</LibrosCtx.Provider>
}
