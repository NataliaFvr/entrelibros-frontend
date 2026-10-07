import { useEffect, useRef, useState } from 'react'
import { getEstadisticas } from '../services/estadisticasService'

// Estadísticas del vendedor { ingresos, unidades, ventas, promedio, categorias, estados } (null mientras cargan).
// Se vuelven a pedir si cambia el conjunto de ventas (la lista llega como un array nuevo en cada render: se compara por contenido).
const useEstadisticasVendedor = (ventas) => {
  const [estado, setEstado] = useState({ datos: null, error: false })
  const ultimas = useRef(ventas)
  useEffect(() => { ultimas.current = ventas })
  const firma = ventas.map((v) => `${v.n}:${v.its.length}`).join('|')
  useEffect(() => {
    let vigente = true
    getEstadisticas(ultimas.current)
      .then((datos) => { if (vigente) setEstado({ datos, error: false }) })
      .catch(() => { if (vigente) setEstado({ datos: null, error: true }) })
    return () => { vigente = false }
  }, [firma])
  return estado
}

export default useEstadisticasVendedor
