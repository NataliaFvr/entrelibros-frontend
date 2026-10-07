import api from './axiosConfig'
import { aTarifasEnvioFront } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// EnvioController: GET /envios -> [{ id, zona: CABA | PROVINCIA_BA | RESTO_PAIS, costoFijo }] (404 si no hay tarifas cargadas).
// El back cobra un costo fijo POR ORDEN según la zona de la dirección de destino. Acá solo se usa para mostrar el costo
// antes de confirmar; el costo definitivo es el `costoEnvio` de la orden que devuelve el checkout.
export const listarTarifasEnvioApi = async () => {
  try {
    return aTarifasEnvioFront((await api.get('/envios')).data)
  } catch (err) {
    if (esListaVacia(err)) return {}
    throw err
  }
}
