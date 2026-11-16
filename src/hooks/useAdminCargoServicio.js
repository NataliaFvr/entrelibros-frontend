import { useEffect } from 'react'
import { mostrarToast } from '../redux/toastSlice'
import { actualizarCargoServicio, fetchCargoServicio } from '../redux/cargoServicioSlice'

// Cargo de servicio del panel de moderación (redux/cargoServicioSlice.js). Se pide una vez; después el PATCH
// actualiza el estado con la respuesta del back. `cambiar` devuelve { ok } o { error, campos }.
const useAdminCargoServicio = ({ dispatch, porcentaje, fechaActualizacion, cargado, error }) => {
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))

  useEffect(() => {
    if (!cargado && !error) dispatch(fetchCargoServicio())
  }, [dispatch, cargado, error])

  const recargar = () => dispatch(fetchCargoServicio())

  const cambiar = async (nuevo) => {
    const resultado = await dispatch(actualizarCargoServicio(nuevo))
    if (resultado.error) return { error: resultado.error.message, campos: resultado.error.campos || {} }
    toast('Cargo de servicio actualizado')
    return { ok: true }
  }

  return { porcentaje, fechaActualizacion, cargado, cargando: !cargado && !error, error: error || '', recargar, cambiar }
}

export default useAdminCargoServicio