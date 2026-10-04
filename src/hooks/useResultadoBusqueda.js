import { useMemo } from 'react'
import { FILTROS_INICIALES, filtrarLibros, masVendidos } from '../utils/filtrarLibros'
import { buscarTiendas } from '../utils/vendedor'

const CANTIDAD_DESTACADOS = 4

// Qué muestra el catálogo para el texto buscado (`q`):
//  - tiendas: vendedores cuyo nombre coincide (para enlazar a su perfil)
//  - sinCoincidencias: el texto, solo, no encuentra ni libros ni vendedores (ignora el resto de los filtros)
//  - destacados: bestsellers para ofrecer cuando no hay coincidencias
const useResultadoBusqueda = (libros, q) => {
  return useMemo(() => {
    const termino = q.trim()
    if (!termino) return { termino, tiendas: [], sinCoincidencias: false, destacados: [] }

    const tiendas = buscarTiendas(libros, termino)
    const hayLibros = filtrarLibros(libros, { ...FILTROS_INICIALES, q: termino, max: Infinity }).length > 0
    const sinCoincidencias = !hayLibros && !tiendas.length
    return { termino, tiendas, sinCoincidencias, destacados: sinCoincidencias ? masVendidos(libros).slice(0, CANTIDAD_DESTACADOS) : [] }
  }, [libros, q])
}

export default useResultadoBusqueda
