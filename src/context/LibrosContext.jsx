import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCategorias, getLibros } from '../services/librosService'
import { imagenesDeCategorias } from '../services/categoriasService'
import { getImagenesApi } from '../api/librosApi'
import { USAR_API } from '../utils/modoApi'
import { LibrosCtx } from './librosCtx'

const EN_PARALELO = 6

const LibrosProvider = ({ children }) => {
  const [libros, setLibros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [imagenesCategorias, setImagenesCategorias] = useState({})
  const [cargando, setCargando] = useState(true)
  const conFotos = useRef(new Set()) // ids de libros cuyas fotos ya se pidieron al back
  const montado = useRef(true)
  useEffect(() => { montado.current = true; return () => { montado.current = false } }, [])

  useEffect(() => {
    Promise.all([getLibros(), getCategorias()])
      .then(([l, c]) => { setLibros(l); setCategorias(c); setImagenesCategorias(imagenesDeCategorias()) }) // las URLs salen de las categorías ya cargadas
      .finally(() => setCargando(false))
  }, [])

  // Con el back, LibroResponse no trae las fotos: se piden por libro (GET /imagenes-libro/libro/{id}) en segundo plano,
  // de a pocos a la vez, y se van sumando al catálogo. Mientras tanto la tarjeta muestra la portada de colores.
  useEffect(() => {
    if (!USAR_API) return
    const pendientes = libros.filter((l) => !conFotos.current.has(l.id))
    if (!pendientes.length) return
    pendientes.forEach((l) => conFotos.current.add(l.id))
    const cola = [...pendientes]
    const trabajar = async () => {
      while (montado.current && cola.length) {
        const libro = cola.shift()
        try {
          const imgs = await getImagenesApi(libro.id)
          if (montado.current && imgs.length) setLibros((actuales) => actuales.map((x) => (x.id === libro.id ? { ...x, imgs } : x)))
        } catch { /* sin fotos por ahora: queda la portada de colores */ }
      }
    }
    Array.from({ length: EN_PARALELO }, trabajar)
  }, [libros])

  // Vuelve a leer el catálogo (por ejemplo, cuando un vendedor publica o da de baja un libro)
  const recargar = useCallback(() => {
    conFotos.current = new Set()
    return getLibros().then(setLibros)
  }, [])
  // Vuelve a leer las categorías (cuando el administrador crea una nueva)
  const recargarCategorias = useCallback(() => getCategorias().then((c) => { setCategorias(c); setImagenesCategorias(imagenesDeCategorias()) }), [])

  const value = useMemo(() => ({ libros, categorias, imagenesCategorias, cargando, recargar, recargarCategorias }), [libros, categorias, imagenesCategorias, cargando, recargar, recargarCategorias])
  return <LibrosCtx.Provider value={value}>{children}</LibrosCtx.Provider>
}

export default LibrosProvider
