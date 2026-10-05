import { useEffect, useMemo, useState } from 'react'
import { fuenteModeracion } from '../services/moderacionFuente'
import { listarOrdenes, listarUsuarios } from '../services/adminService'
import { ETIQUETAS_PAGO } from '../utils/pedidos'

const mensajeDe = (err) => (err && err.message) || 'No pudimos traer las solicitudes. Intentá de nuevo.'

// Números del resumen: libros por moderar (misma cola que el panel de moderación), usuarios activos,
// órdenes, total cobrado y órdenes por estado de pago.
const useAdminResumen = () => {
  const [pendientes, setPendientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vivo = true
    fuenteModeracion.obtenerSolicitudes()
      .then((lista) => { if (vivo) setPendientes(lista) })
      .catch((err) => { if (vivo) setError(mensajeDe(err)) })
      .finally(() => { if (vivo) setCargando(false) })
    return () => { vivo = false }
  }, [])

  const datos = useMemo(() => {
    const ordenes = listarOrdenes()
    const cobrado = ordenes.filter((o) => o.estadoPago === 'SIMULADO_APROBADO').reduce((suma, o) => suma + o.total, 0)
    const porEstado = Object.keys(ETIQUETAS_PAGO)
      .map((estado) => [estado, ordenes.filter((o) => o.estadoPago === estado).length])
      .filter(([, cantidad]) => cantidad > 0)
    return {
      usuariosActivos: listarUsuarios().filter((u) => u.estado === 'ACTIVO').length,
      totalOrdenes: ordenes.length, cobrado, porEstado,
    }
  }, [])

  return { pendientes, cargando, error, ...datos }
}

export default useAdminResumen
