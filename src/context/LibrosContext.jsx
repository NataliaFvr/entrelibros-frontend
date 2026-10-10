import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCategorias, getLibros } from '../api/librosApiExtra'
import { imagenesDeCategorias } from '../api/categoriasApiExtra'
import { useToast } from '../hooks/useToast'
import { mensajeError } from '../utils/errorApi'
import { LibrosCtx } from './librosCtx'

const LibrosProvider = ({ children }) => {
  const [libros, setLibros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [imagenesCategorias, setImagenesCategorias] = useState({})
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false) // true si el catálogo no se pudo leer (red, 500…): distinto de "no hay libros"
  const toast = useToast()
  const avisar = useRef(toast)
  useEffect(() => { avisar.current = toast })

  useEffect(() => {
    Promise.all([getLibros(), getCategorias()])
      .then(([l, c]) => { setLibros(l); setCategorias(c); setImagenesCategorias(imagenesDeCategorias()) }) // las URLs salen de las categorías ya cargadas
      .catch((err) => { setErrorCarga(true); avisar.current(mensajeError(err)) })
      .finally(() => setCargando(false))
  }, [])

  // Vuelve a leer el catálogo (por ejemplo, cuando un vendedor publica o da de baja un libro)
  const recargar = useCallback(() => {
    return getLibros()
      .then((l) => { setLibros(l); setErrorCarga(false) })
      .catch((err) => { setErrorCarga(true); avisar.current(mensajeError(err)) })
  }, [])
  // Vuelve a leer las categorías (cuando el administrador crea una nueva)
  const recargarCategorias = useCallback(() => getCategorias().then((c) => { setCategorias(c); setImagenesCategorias(imagenesDeCategorias()) }), [])

  const value = useMemo(() => ({ libros, categorias, imagenesCategorias, cargando, errorCarga, recargar, recargarCategorias }), [libros, categorias, imagenesCategorias, cargando, errorCarga, recargar, recargarCategorias])
  return <LibrosCtx.Provider value={value}>{children}</LibrosCtx.Provider>
}

export default LibrosProvider
