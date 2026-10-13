import { useCallback, useEffect, useMemo, useState } from 'react'
import { cancelarVentaApi, listarVentasApi } from '../api/ventasApi'
import { aVentaFront } from '../api/adaptadores'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { mensajeError } from '../utils/errorApi'

// Ventas del vendedor en el formato { id, n, date, est, cancelada, its, comprador }.
// Se piden una vez al abrir la pantalla; cada respuesta ya trae el detalle de su venta.
// No se hace seguimiento de envíos: la venta solo puede estar paga o cancelada.
const useVentas = (user) => {
  const idVendedor = user.id
  const toast = useToast()
  const { recargar } = useLibros()
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))
  const [ocupado, setOcupado] = useState(null) // id de la venta con una acción en curso

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

  // PATCH /ordenes/vendedor/{id}/cancelar: la venta queda CANCELADA y el back devuelve el stock de esos libros
  const cancelarVenta = useCallback(async (venta) => {
    setOcupado(venta.id)
    try {
      await cancelarVentaApi(venta.id)
      setCrudas((prev) => prev.map((c) => (c.id === venta.id ? { ...c, estado: 'CANCELADA' } : c)))
      toast('Venta cancelada. Devolvimos el stock de tus libros.')
      recargar()
    } catch (err) {
      toast(mensajeError(err))
    } finally {
      setOcupado(null)
    }
  }, [toast, recargar])

  return { ventas, cargando, ocupado, cancelarVenta }
}

export default useVentas
