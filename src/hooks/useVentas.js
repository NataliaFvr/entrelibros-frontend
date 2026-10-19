import { useCallback, useEffect, useMemo, useState } from 'react'
import { cancelarVentaApi, listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../api/adaptadores'
import { useToast } from './useToast'
import { mensajeError } from '../utils/errorApi'

// Ventas del vendedor en el formato { id, n, date, estado, est, cancelada, venceEn, its, comprador }.
// Se vuelven a pedir cada vez que se abre la pestaña de ventas (`activo`): una compra hecha con el panel ya abierto
// aparece sin recargar la página.
const useVentas = (user, activo = true) => {
  const idVendedor = user.id
  const toast = useToast()
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (idVendedor == null || !activo) return undefined
    let vigente = true
    listarVentasApi()
      .then((ventas) => { if (vigente) setCrudas(ventas) })
      .catch(() => { if (vigente) setCrudas([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor, activo, version])

  const ventas = useMemo(() => crudas
    .map(aVentaFront)
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || Number(b.n) - Number(a.n)), [crudas])

  const cancelar = useCallback(async (idOrdenVendedor) => {
    try {
      await cancelarVentaApi(idOrdenVendedor)
      toast('Venta cancelada. Los libros volvieron a tu stock.')
    } catch (err) {
      toast(mensajeError(err))
    }
    setVersion((v) => v + 1)
  }, [toast])

  return { ventas, cargando, cancelar }
}

export default useVentas
