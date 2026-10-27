import { useCallback, useEffect, useMemo, useState } from 'react'
import { cancelarVentaApi, listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../api/adaptadores'
import { useToast } from './useToast'
import { mensajeError } from '../utils/errorApi'

// Ventas del vendedor en el formato { id, n, date, estado, est, cancelada, venceEn, its, comprador }.
// Se piden al entrar al panel (la cabecera muestra cuántas ventas hay) y se vuelven a pedir cada vez que se abre la
// pestaña de ventas o estadísticas (`activo`): una compra hecha con el panel ya abierto aparece sin recargar la página.
const useVentas = (user, activo = true) => {
  const idVendedor = user.id
  const toast = useToast()
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (idVendedor == null) return undefined
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
      // El back devuelve la venta completa ya cancelada: se reemplaza en la lista sin volver a pedirla
      const venta = await cancelarVentaApi(idOrdenVendedor)
      setCrudas((lista) => lista.map((v) => (v.id === venta.id ? venta : v)))
      toast('Venta cancelada. Los libros volvieron a tu stock.')
    } catch (err) {
      toast(mensajeError(err))
      setVersion((v) => v + 1) // por ejemplo, el comprador ya pagó: se trae cómo quedó
    }
  }, [toast])

  return { ventas, cargando, cancelar }
}

export default useVentas
