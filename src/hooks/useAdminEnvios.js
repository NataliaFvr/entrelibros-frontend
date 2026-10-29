import { useToast } from './useToast'
import useTarifasEnvio from './useTarifasEnvio'
import { actualizarTarifaEnvioApi, crearTarifaEnvioApi } from '../api/enviosApi'
import { normalizarError } from '../utils/errorApi'

// Tarifas de envío vigentes, alta de las que faltan y cambio de precio.
// `cambiar` y `crear` devuelven (una Promesa de) { ok } o { error }.
const useAdminEnvios = () => {
  const toast = useToast()
  const { aplicar, ids, cargada, ...tarifas } = useTarifasEnvio()

  const guardar = async (accion, mensaje) => {
    try {
      // La respuesta del PATCH/POST ya trae la tarifa actualizada: se usa esa, sin un GET nuevo
      aplicar(await accion())
      toast(mensaje)
      return { ok: true }
    } catch (err) {
      return { error: normalizarError(err).mensaje || 'No pudimos guardar la tarifa. Intentá de nuevo.' }
    }
  }

  const cambiar = (tipo, costo) => guardar(() => actualizarTarifaEnvioApi(ids[tipo], costo), 'Tarifa actualizada')
  // POST /envios: sin tarifa creada el checkout responde 404, así que el panel permite sembrarla.
  const crear = (tipo, costo) => guardar(() => crearTarifaEnvioApi(tipo, costo), 'Tarifa creada')

  return { tarifas, cargada, cambiar, crear }
}

export default useAdminEnvios