import { useEffect, useMemo, useState } from 'react'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { POR_PAGINA } from '../data/admin'
import { fetchOrdenesAdmin } from '../redux/adminSlice'

// Órdenes de la plataforma (las más nuevas primero) con filtro por estado de pago y paginación
const useAdminOrdenes = () => {
  const dispatch = useReduxDispatch()
  const { ordenes, ordenesCargadas } = useReduxSelector((state) => state.admin)
  const [estado, setEstado] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    if (!ordenesCargadas) dispatch(fetchOrdenesAdmin())
  }, [dispatch, ordenesCargadas])

  const filtradas = useMemo(
    () => ordenes.filter((o) => !estado || o.estadoPago === estado), // el back ya las manda de la más nueva a la más vieja
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
