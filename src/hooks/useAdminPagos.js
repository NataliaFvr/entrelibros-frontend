import { useEffect, useMemo, useState } from 'react'
<<<<<<< HEAD
import { cargarPagos } from '../services/adminService'
=======
import { cargarPagos } from '../api/adminApi'
>>>>>>> 726f86e (Union)
import { POR_PAGINA } from '../data/admin'

// Pagos registrados con sus totales (aprobados, rechazados y monto cobrado) y paginación.
const useAdminPagos = () => {
  const [pagos, setPagos] = useState([])
  useEffect(() => {
    let vigente = true
    cargarPagos().then((lista) => { if (vigente) setPagos(lista) }).catch(() => {}) // GET /pagos (ADMIN)
    return () => { vigente = false }
  }, [])
  const [pagina, setPagina] = useState(1)

  const resumen = useMemo(() => {
    const aprobados = pagos.filter((p) => p.resultado === 'SIMULADO_APROBADO')
    return {
      totalAprobado: aprobados.reduce((suma, p) => suma + p.monto, 0),
      aprobados: aprobados.length,
      rechazados: pagos.length - aprobados.length,
    }
  }, [pagos])

  const paginas = Math.max(1, Math.ceil(pagos.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, paginas)

  return {
    ...resumen, hayPagos: pagos.length > 0,
    visibles: pagos.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA),
    pagina: paginaActual, paginas, setPagina,
  }
}

export default useAdminPagos
