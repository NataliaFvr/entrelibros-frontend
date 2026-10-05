import { useState } from 'react'
import { useToast } from './useToast'
import { cambiarTarifaEnvio } from '../services/adminService'
import { getTarifas } from '../services/enviosService'

// Tarifas de envío vigentes y cambio de precio. `cambiar` devuelve { ok } o { error }.
const useAdminEnvios = () => {
  const toast = useToast()
  const [tarifas, setTarifas] = useState(getTarifas)

  const cambiar = (tipo, costo) => {
    try {
      cambiarTarifaEnvio(tipo, costo)
      setTarifas(getTarifas())
      toast('Tarifa actualizada')
      return { ok: true }
    } catch (err) {
      return { error: (err && err.message) || 'No pudimos guardar la tarifa. Intentá de nuevo.' }
    }
  }

  return { tarifas, cambiar }
}

export default useAdminEnvios
