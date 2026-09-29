import { useState } from 'react'
import { FILTROS_INICIALES } from '../utils/filtrarLibros'

// Estado de los filtros del catálogo. Cualquier cambio de filtro vuelve a la página 1.
const useFiltros = (inicial) => {
  const [f, setF] = useState(inicial)

  const set = (cambios) => setF((prev) => ({ ...prev, ...cambios, page: 1 }))
  const setPage = (page) => setF((prev) => ({ ...prev, page }))
  const toggle = (clave, valor) =>
    setF((prev) => {
      const actual = prev[clave]
      const nuevo = actual.includes(valor) ? actual.filter((x) => x !== valor) : [...actual, valor]
      return { ...prev, [clave]: nuevo, page: 1 }
    })
  // Limpiar mantiene el orden elegido
  const limpiar = () => setF((prev) => ({ ...FILTROS_INICIALES, cats: [], envios: [], sort: prev.sort }))

  return { f, set, setPage, toggle, limpiar }
}

export default useFiltros
