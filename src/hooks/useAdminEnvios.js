import { useToast } from './useToast'
import useTarifasEnvio from './useTarifasEnvio'
import { actualizarTarifaEnvioApi } from '../api/enviosApi'
import { normalizarError } from '../utils/errorApi'

// Tarifas de envío vigentes y cambio de precio. `cambiar` devuelve (una Promesa de) { ok } o { error }.
const useAdminEnvios = () => {
  const toast = useToast()
  const { recargar, ids, ...tarifas } = useTarifasEnvio()

  const cambiar = async (tipo, costo) => {
    try {
      await actualizarTarifaEnvioApi(ids[tipo], costo)
      recargar()
      toast('Tarifa actualizada')
      return { ok: true }
    } catch (err) {
      return { error: normalizarError(err).mensaje || 'No pudimos guardar la tarifa. Intentá de nuevo.' }
    }
  }

  return { tarifas, cambiar }
}

export default useAdminEnvios
