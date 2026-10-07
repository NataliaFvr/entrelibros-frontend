import api from './axiosConfig'
import { aEstadisticasFront } from '../utils/adaptadores'

// VendedoresController (rol VENDEDOR): GET /vendedores/estadisticas -> EstadisticasVendedorResponse
// { ingresosTotales, unidadesVendidas, cantidadVentas, promedioPorVenta, ventasPorCategoria[], ventasPorEstado[] (NUEVO/USADO) }
export const getEstadisticasVendedorApi = async () => aEstadisticasFront((await api.get('/vendedores/estadisticas')).data)
