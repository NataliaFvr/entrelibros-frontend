import { getEstadisticasVendedorApi } from '../api/estadisticasApi'
import { calcularEstadisticas } from '../utils/estadisticas'
import { elegirFuente } from '../utils/modoApi'

// Pasarela de estadísticas del vendedor: devuelve siempre el mismo modelo, venga del back o de la demo.
// `ventas` solo lo usa la demo (el back calcula todo con sus órdenes pagadas).
export const getEstadisticas = elegirFuente(
  () => getEstadisticasVendedorApi(),
  async (ventas) => calcularEstadisticas(ventas), // DEMO-ONLY
)
