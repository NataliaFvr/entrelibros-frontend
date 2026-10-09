import { useEffect, useMemo, useState } from 'react'
import { listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../utils/adaptadores'

// Ventas del vendedor en el formato { n, date, est, its, comprador }.
// Se piden una vez al abrir la pantalla y se arman con el catálogo (categoría y usado).
const useVentas = (user, _tienda, libros) => {
  const idVendedor = user.id
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    listarVentasApi()
      .then((r) => { if (vigente) setCrudas(r) })
      .catch(() => { if (vigente) setCrudas([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor])

  const delBack = useMemo(() => crudas
    .map(({ ordenVendedor, orden }) => aVentaFront(ordenVendedor, orden, idVendedor, libros))
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date)), [crudas, idVendedor, libros])

  return { ventas: delBack, cargando }
}

export default useVentas
