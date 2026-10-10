import { useEffect, useMemo, useState } from 'react'
import { listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../api/adaptadores'

// Ventas del vendedor en el formato { n, date, est, its, comprador }.
// Se piden una vez al abrir la pantalla; cada respuesta ya trae el detalle de su venta.
const useVentas = (user, _tienda, _libros) => {
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
    .map(aVentaFront)
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date)), [crudas])

  return { ventas: delBack, cargando }
}

export default useVentas
