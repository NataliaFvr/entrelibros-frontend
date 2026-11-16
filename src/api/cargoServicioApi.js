import api from './axiosConfig'

// CargoServicioController (solo ADMIN). El cargo de servicio es un porcentaje sobre el precio de los libros (sin el envío),
// uno por orden. El comprador no usa estas rutas: la cotización del carrito y cada orden ya traen el cargo calculado.
//   GET   /configuracion/cargo-servicio                  -> { porcentaje, fechaActualizacion } (0 y null si nunca se configuró)
//   PATCH /configuracion/cargo-servicio { porcentaje }   -> la configuración nueva (400 con el error del campo si no es válido)

export const obtenerCargoServicioApi = async () => (await api.get('/configuracion/cargo-servicio')).data

export const actualizarCargoServicioApi = async (porcentaje) =>
  (await api.patch('/configuracion/cargo-servicio', { porcentaje })).data