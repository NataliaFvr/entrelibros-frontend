import { useEffect, useMemo, useState } from 'react'
import { listarVentasApi } from '../api/ventasApi'
import { ventasDe } from '../services/ventasService'
import { USAR_API } from '../utils/modoApi'
import { aVentaFront } from '../utils/adaptadores'

// Ventas del vendedor en el formato { n, date, est, its, comprador }.
// Con el back se piden una vez al abrir la pantalla y se arman con el catálogo (categoría y usado); en demo salen del almacenamiento local.
const useVentas = (user, tienda, libros) => {
  const idVendedor = USAR_API ? user.id : null
  const [crudas, setCrudas] = useState([])
  const [cargando, setCargando] = useState(Boolean(idVendedor))

  useEffect(() => {
    if (idVendedor == null) return undefined
    let vigente = true
    listarVentasApi()
      .then((r) => { if (vigente) setCrudas(r) })
      .catch(() => { if (vigente) setCrudas([]) })
      .finally(() => { if (vigente) setCargando(false) })
    return () => { vigente = false }
  }, [idVendedor])

  const delBack = useMemo(() => crudas
    .map(({ ordenVendedor, orden }) => aVentaFront(ordenVendedor, orden, idVendedor, libros))
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date)), [crudas, idVendedor, libros])

  return { ventas: USAR_API ? delBack : ventasDe(tienda, libros), cargando }
}

export default useVentas
