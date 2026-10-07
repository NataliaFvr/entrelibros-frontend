import { useEffect, useMemo, useState } from 'react'
import { useLibros } from './useLibros'
import { buscarVendedor } from '../services/vendedorPublicoService'
import { getVendedorPublicoApi } from '../api/vendedoresApi'
import { slugVendedor } from '../utils/vendedor'
import { USAR_API } from '../utils/modoApi'

// Vendedor de /vendedor/:id + sus libros activos. `vendedor` es null si el id no existe.
// Devuelve { cargando, vendedor, libros, redirigirA }. `redirigirA` = id numérico al que hay que llevar un enlace viejo con slug.

// Con el back el :id es el id numérico del vendedor (GET /vendedores/{id}); si ese endpoint no responde, se arma con el catálogo
const useVendedorPublicoApi = (param) => {
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

// DEMO-ONLY: el :id es el slug del nombre de la tienda
const useVendedorPublicoDemo = (slug) => {
  const { libros, cargando } = useLibros()
  const vendedor = useMemo(() => (cargando ? null : buscarVendedor(slug, libros)), [slug, libros, cargando])
  const delVendedor = useMemo(() => (vendedor ? libros.filter((l) => l.v === vendedor.tienda) : []), [vendedor, libros])
  return { cargando, vendedor, libros: delVendedor, redirigirA: null }
}

const useVendedorPublico = USAR_API ? useVendedorPublicoApi : useVendedorPublicoDemo

export default useVendedorPublico
