import { useEffect } from 'react'
import { fetchEstadisticas } from '../redux/ventasSlice'

// Estadísticas del vendedor { ingresos, unidades, ventas, promedio, categorias, estados } (null mientras cargan).
// GET /vendedores/estadisticas la primera vez que se abre la pestaña; después quedan en Redux (redux/ventasSlice.js).
const useEstadisticasVendedor = ({ dispatch, estadisticas, errorEstadisticas }) => {
  const pedir = estadisticas === null && !errorEstadisticas

  useEffect(() => {
    if (pedir) dispatch(fetchEstadisticas())
  }, [dispatch, pedir])

  return { datos: estadisticas, error: Boolean(errorEstadisticas) }
}

export default useEstadisticasVendedor
