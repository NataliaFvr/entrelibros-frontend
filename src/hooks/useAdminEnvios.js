import { mostrarToast } from '../redux/toastSlice'
import { actualizarTarifa, crearTarifa } from '../redux/enviosSlice'
import useTarifasEnvio from './useTarifasEnvio'

// `cambiar` y `crear` devuelven { ok } o { error }
const useAdminEnvios = ({ dispatch, tarifasState }) => {
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const { cargada, ...tarifas } = useTarifasEnvio({ dispatch, ...tarifasState })

  const guardar = async (accion, mensaje) => {
    const resultado = await dispatch(accion)
    if (resultado.error) return { error: resultado.error.message }
    toast(mensaje)
    return { ok: true }
  }

  const cambiar = (zona, costo) => guardar(actualizarTarifa({ zona, costo }), 'Tarifa actualizada')
  // Sin tarifa creada el checkout responde 404: el panel permite crearla
  const crear = (zona, costo) => guardar(crearTarifa({ zona, costo }), 'Tarifa creada')

  return { tarifas, cargada, cambiar, crear }
}

export default useAdminEnvios
