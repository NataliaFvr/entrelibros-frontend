import { useCallback, useEffect, useMemo, useState } from 'react'
import { cancelarVentaApi, listarVentasApi } from '../api/ventasApi'
import { listarEnviosApi, registrarEnvioApi } from '../api/envioItemsApi'
import { aVentaFront } from '../api/adaptadores'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { mensajeError } from '../utils/errorApi'

// Ventas del vendedor en el formato { id, n, date, est, cancelada, enviada, its, comprador }.
// Se piden una vez al abrir la pantalla; cada respuesta ya trae el detalle de su venta.
// El back no marca "enviada" en la venta: la registración es un EnvioItem aparte, así que se consulta
// GET /envio-items una sola vez y se cruza por idOrdenVendedor.
const useVentas = (user) => {
  const idVendedor = user.id
  const toast = useToast()
  const { recargar } = useLibros()
  const [crudas, setCrudas] = useState([])
  const [enviadas, setEnviadas] = useState(() => new Set()) // ids de OrdenVendedor con envío registrado
  const [cargando, setCargando] = useState(Boolean(idVendedor))
  const [ocupado, setOcupado] = useState(null) // id de la venta con una acción en curso

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    Promise.all([
      listarVentasApi(),
      listarEnviosApi().catch(() => []), // si falla, las ventas se ven igual (registrar es idempotente en el back)
    ])
      .then(([ventas, envios]) => {
        if (!vigente) return
        setCrudas(ventas)
        setEnviadas(new Set(envios.map((e) => e.idOrdenVendedor)))
      })
      .catch(() => { if (vigente) setCrudas([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor])

  const ventas = useMemo(() => crudas
    .map(aVentaFront)
    .filter(Boolean)
    .map((v) => ({ ...v, enviada: enviadas.has(v.id) }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id), [crudas, enviadas])

  // POST /envio-items { idOrdenVendedor }
  const registrarEnvio = useCallback(async (venta) => {
    setOcupado(venta.id)
    try {
      const envio = await registrarEnvioApi(venta.id)
      setEnviadas((prev) => new Set(prev).add(envio.idOrdenVendedor ?? venta.id))
      toast('Envío registrado. El comprador ya puede saber que su pedido salió.')
    } catch (err) {
      toast(mensajeError(err))
    } finally {
      setOcupado(null)
    }
  }, [toast])

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

  return { ventas, cargando, ocupado, registrarEnvio, cancelarVenta }
}

export default useVentas
