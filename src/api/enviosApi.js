import api from './axiosConfig'
import { aTarifasEnvioFront } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// EnvioController: GET /envios -> [{ id, zona: 'misma' | 'distinta', costoFijo }].
// El back cobra un envío por vendedor según si comparte provincia con el comprador; el costo definitivo
// es el `costoEnvio` de la orden que devuelve el checkout.
export const listarTarifasEnvioApi = async () => {
  try {
    return aTarifasEnvioFront((await api.get('/envios')).data)
  } catch (err) {
    if (esListaVacia(err)) return aTarifasEnvioFront([])
    throw err
  }
}

// PATCH /envios/{id} { costoFijo } — solo ADMIN
export const actualizarTarifaEnvioApi = async (idEnvio, costoFijo) =>
  (await api.patch(`/envios/${idEnvio}`, { costoFijo })).data
