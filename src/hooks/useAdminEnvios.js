import { useToast } from './useToast'
import useTarifasEnvio from './useTarifasEnvio'
import { cambiarTarifaEnvio } from '../services/adminService'
import { actualizarTarifaEnvioApi } from '../api/enviosApi'
import { normalizarError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'

// Tarifas de envío vigentes y cambio de precio. `cambiar` devuelve (una Promesa de) { ok } o { error }.
const useAdminEnvios = () => {
  const toast = useToast()
  const { recargar, ids, ...tarifas } = useTarifasEnvio()

  const cambiar = async (tipo, costo) => {
    try {
      if (USAR_API) await actualizarTarifaEnvioApi(ids[tipo], costo)
      else cambiarTarifaEnvio(tipo, costo)
      recargar()
      toast('Tarifa actualizada')
      return { ok: true }
    } catch (err) {
      const mensaje = USAR_API ? normalizarError(err).mensaje : err && err.message
      return { error: mensaje || 'No pudimos guardar la tarifa. Intentá de nuevo.' }
    }
  }

  return { tarifas, cambiar }
}

export default useAdminEnvios
