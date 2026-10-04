import { useMemo } from 'react'
import { useLibros } from './useLibros'
import { buscarVendedor } from '../services/vendedorPublicoService'

// Vendedor de /vendedor/:id + sus libros activos. `vendedor` es null si el id no existe.
const useVendedorPublico = (id) => {
  const { libros, cargando } = useLibros()

  const vendedor = useMemo(() => (cargando ? null : buscarVendedor(id, libros)), [id, libros, cargando])
  const delVendedor = useMemo(() => (vendedor ? libros.filter((l) => l.v === vendedor.tienda) : []), [vendedor, libros])

  return { cargando, vendedor, libros: delVendedor }
}

export default useVendedorPublico
