import { useEffect, useMemo, useState } from 'react'
import { useLibros } from './useLibros'
import { getVendedorPublicoApi } from '../api/vendedoresApi'
import { slugVendedor } from '../utils/vendedor'

// Vendedor de /vendedor/:id + sus libros activos. `vendedor` es null si el id no existe.
// Devuelve { cargando, vendedor, libros, redirigirA }. `redirigirA` = id numérico al que hay que llevar un enlace viejo con slug.

const useVendedorPublico = (param) => {
  const { libros, cargando } = useLibros()
  const id = /^\d+$/.test(param) ? Number(param) : null
  const [remoto, setRemoto] = useState({ id: null, datos: null })

  useEffect(() => {
    if (id == null) return undefined
    let vigente = true
    getVendedorPublicoApi(id).catch(() => null).then((datos) => { if (vigente) setRemoto({ id, datos }) })
    return () => { vigente = false }
  }, [id])

  const delVendedor = useMemo(() => (id == null ? [] : libros.filter((l) => l.vId === id)), [libros, id])
  const vendedor = id == null ? null
    : remoto.id === id && remoto.datos ? remoto.datos
      : delVendedor.length ? { id, tienda: delVendedor[0].v, verificado: true } : null
  // Enlaces viejos /vendedor/libreria-x: se llevan al id numérico
  const redirigirA = id == null && !cargando ? libros.find((l) => l.vId != null && slugVendedor(l.v) === param)?.vId ?? null : null

  return { cargando: cargando || (id != null && remoto.id !== id), vendedor, libros: delVendedor, redirigirA }
}

export default useVendedorPublico
