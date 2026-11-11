import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { aVentaFront } from '../api/adaptadores'
import { cancelarVenta, fetchVentas } from '../redux/ventasSlice'
import { useToast } from './useToast'

// Ventas del vendedor en el formato { id, n, date, estado, est, cancelada, venceEn, its, comprador }.
// Se piden una vez al entrar al panel (la cabecera muestra cuántas ventas hay) y después viven en Redux (redux/ventasSlice.js).
const useVentas = (user) => {
  const dispatch = useDispatch()
  const toast = useToast()
  const { idUsuario, items, loading, error } = useSelector((state) => state.ventas)
  const cargadas = idUsuario === user.id

  useEffect(() => {
    if (!cargadas) dispatch(fetchVentas(user.id))
  }, [dispatch, cargadas, user.id])

  const ventas = useMemo(() => (cargadas ? items : [])
    .map(aVentaFront)
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || Number(b.n) - Number(a.n)), [cargadas, items])

  const cancelar = useCallback(async (idOrdenVendedor) => {
    // El back devuelve la venta ya cancelada: el slice la reemplaza en la lista sin volver a pedirla
    const resultado = await dispatch(cancelarVenta(idOrdenVendedor))
    if (resultado.error) {
      toast(resultado.error.message)
      dispatch(fetchVentas(user.id)) // por ejemplo, el comprador ya pagó: se trae cómo quedó
      return
    }
    toast('Venta cancelada. Los libros volvieron a tu stock.')
  }, [dispatch, toast, user.id])

  return { ventas, cargando: loading || (!cargadas && !error), cancelar }
}

export default useVentas
