import { useEffect, useMemo, useState } from 'react'
import { listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../api/adaptadores'

// Ventas del vendedor en el formato { id, n, date, est, cancelada, its, comprador }.
// Se piden una vez al abrir la pantalla; cada respuesta ya trae el detalle de su venta.
// No se hace seguimiento de envíos: la venta solo puede estar paga o cancelada.
const useVentas = (user) => {
  const idVendedor = user.id
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    listarVentasApi()
      .then((ventas) => { if (vigente) setCrudas(ventas) })
      .catch(() => { if (vigente) setCrudas([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor])

  const ventas = useMemo(() => crudas
    .map(aVentaFront)
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id), [crudas])

  return { ventas, cargando }
}

export default useVentas
