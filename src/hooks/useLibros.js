import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { urlImagenCategoria } from '../api/categoriasApi'

export const useLibros = () => {
  const { items: libros, loading, error } = useSelector((state) => state.libros)
  const { items: listaCategorias } = useSelector((state) => state.libros.categorias)
  const categorias = useMemo(() => listaCategorias.map((c) => c.nombre), [listaCategorias])
  const imagenesCategorias = useMemo(
    () => Object.fromEntries(listaCategorias.filter((c) => c.tieneImagen).map((c) => [c.nombre, urlImagenCategoria(c.id)])),
    [listaCategorias],
  )
  return {
    libros, categorias, imagenesCategorias,
    cargando: loading && libros.length === 0, // recargar no vuelve a mostrar "cargando"
    errorCarga: Boolean(error),
  }
}