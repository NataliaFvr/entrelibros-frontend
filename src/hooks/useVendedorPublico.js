import { useEffect, useMemo } from 'react'
import { fetchVendedorPublico } from '../redux/vendedoresSlice'
import { slugVendedor } from '../utils/vendedor'

// Vendedor de /vendedor/:id + sus libros activos. `vendedor` es null si el id no existe.
// Devuelve { cargando, vendedor, libros, redirigirA }. `redirigirA` = id numérico al que hay que llevar un enlace viejo con slug.

const useVendedorPublico = (param, { dispatch, libros, cargando, guardado }) => {
  const id = /^\d+$/.test(param) ? Number(param) : null

  // Se pide una vez por vendedor: volver a su perfil no lo pide de nuevo
  useEffect(() => {
    if (id != null && guardado === undefined) dispatch(fetchVendedorPublico(id))
  }, [dispatch, id, guardado])

  const delVendedor = useMemo(() => (id == null ? [] : libros.filter((l) => l.vId === id)), [libros, id])
  const vendedor = guardado || null
  // Enlaces viejos /vendedor/libreria-x: se llevan al id numérico
  const redirigirA = id == null && !cargando ? libros.find((l) => l.vId != null && slugVendedor(l.v) === param)?.vId ?? null : null

  return { cargando: cargando || (id != null && guardado === undefined), vendedor, libros: delVendedor, redirigirA }
}

export default useVendedorPublico
