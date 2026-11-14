import { useEffect, useMemo } from 'react'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { fetchOrdenesAdmin } from '../redux/adminSlice'
import { fetchSolicitudes } from '../redux/moderacionSlice'
import { fetchUsuarios } from '../redux/usuariosSlice'
import { ETIQUETAS_PAGO } from '../utils/pedidos'

// Usa las mismas listas que las otras pantallas del admin: si ya estaban, no se piden de nuevo
const useAdminResumen = () => {
  const dispatch = useReduxDispatch()
  const moderacion = useReduxSelector((state) => state.moderacion)
  const { items: usuarios, cargados: usuariosCargados } = useReduxSelector((state) => state.usuarios)
  const { ordenes, ordenesCargadas } = useReduxSelector((state) => state.admin)

  useEffect(() => {
    if (!moderacion.cargadas) dispatch(fetchSolicitudes())
    if (!usuariosCargados) dispatch(fetchUsuarios())
    if (!ordenesCargadas) dispatch(fetchOrdenesAdmin())
  }, [dispatch, moderacion.cargadas, usuariosCargados, ordenesCargadas])

  const datos = useMemo(() => {
    const cobrado = ordenes.filter((o) => o.estadoPago === 'SIMULADO_APROBADO').reduce((suma, o) => suma + o.total, 0)
    const porEstado = Object.keys(ETIQUETAS_PAGO)
      .map((estado) => [estado, ordenes.filter((o) => o.estadoPago === estado).length])
      .filter(([, cantidad]) => cantidad > 0)
    return {
      usuariosActivos: usuarios.filter((u) => u.estado === 'ACTIVO').length,
      totalOrdenes: ordenes.length, cobrado, porEstado,
    }
  }, [usuarios, ordenes])

  return {
    pendientes: moderacion.items,
    cargando: moderacion.loading || (!moderacion.cargadas && !moderacion.error),
    error: moderacion.error || '',
    ...datos,
  }
}

export default useAdminResumen
