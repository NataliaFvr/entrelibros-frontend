import { useEffect, useMemo, useState } from 'react'
import { fuenteModeracion } from '../services/moderacionFuente'
import { cargarOrdenes, cargarUsuarios } from '../services/adminService'
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

  // Usuarios y órdenes (con el back: GET /usuarios y GET /ordenes)
  const [usuarios, setUsuarios] = useState([])
  const [ordenes, setOrdenes] = useState([])
  useEffect(() => {
    let vigente = true
    cargarUsuarios().then((l) => { if (vigente) setUsuarios(l) }).catch(() => {})
    cargarOrdenes().then((l) => { if (vigente) setOrdenes(l) }).catch(() => {})
    return () => { vigente = false }
  }, [])

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

  return { pendientes, cargando, error, ...datos }
}

export default useAdminResumen
