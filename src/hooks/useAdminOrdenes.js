import { useEffect, useMemo, useState } from 'react'
import { cargarOrdenes } from '../api/adminApi'
import { POR_PAGINA } from '../data/admin'

// Órdenes de la plataforma: las más recientes primero, con filtro por estado de pago y paginación.
// Con el back: GET /ordenes (ADMIN) + el detalle de cada una.
const useAdminOrdenes = () => {
  const [ordenes, setOrdenes] = useState([])
  const [estado, setEstado] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let vigente = true
    cargarOrdenes().then((lista) => { if (vigente) setOrdenes(lista) }).catch(() => {})
    return () => { vigente = false }
  }, [])

  const filtradas = useMemo(
    () => ordenes
      .filter((o) => !estado || o.estadoPago === estado)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.n.localeCompare(a.n)),
    [ordenes, estado],
  )

  const paginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, paginas)

  const filtrar = (valor) => {
    setEstado(valor)
    setPagina(1)
  }

  return {
    estado, filtrar, hayOrdenes: ordenes.length > 0, total: filtradas.length,
    visibles: filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA),
    pagina: paginaActual, paginas, setPagina,
  }
}

export default useAdminOrdenes
