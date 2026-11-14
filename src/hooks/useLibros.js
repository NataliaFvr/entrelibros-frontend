import { useMemo } from 'react'
import { urlImagenCategoria } from '../api/categoriasApi'

export const useLibros = ({ libros, loading, error, listaCategorias }) => {
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