import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategorias } from '../Redux/categoriasSlice'
import { fetchLibros } from '../Redux/librosSlice'
import { urlImagenCategoria } from '../api/categoriasApi'

export const useLibros = () => {
  const dispatch = useDispatch()
  const { items: libros, loading, error } = useSelector((state) => state.libros)
  const { items: listaCategorias } = useSelector((state) => state.categorias)
  const categorias = useMemo(() => listaCategorias.map((c) => c.nombre), [listaCategorias])
  const imagenesCategorias = useMemo(
    () => Object.fromEntries(listaCategorias.filter((c) => c.tieneImagen).map((c) => [c.nombre, urlImagenCategoria(c.id)])),
    [listaCategorias],
  )
  return {
    libros, categorias, imagenesCategorias,
    cargando: loading && libros.length === 0, // recargar no vuelve a mostrar "cargando"
    errorCarga: Boolean(error),
    recargar: () => dispatch(fetchLibros()), // cuando un vendedor publica o da de baja un libro
    recargarCategorias: () => dispatch(fetchCategorias()), // cuando el administrador crea una nueva
  }
}