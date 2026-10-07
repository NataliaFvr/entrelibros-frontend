import { USAR_API_LIBROS } from '../utils/modoApi'
import { masViejasPrimero } from '../utils/ordenSolicitudes'
import * as api from './moderacionService'
import * as demo from './moderacionDemo'

// Origen de la cola de moderación: el back si VITE_API_LIBROS=true, si no los datos de demostración.
// Lo usan el panel de moderación y el resumen del administrador, para que ambos cuenten lo mismo
// y los dos vean la cola en el mismo orden: las solicitudes más viejas primero.
const origen = USAR_API_LIBROS ? api : demo

export const fuenteModeracion = {
  ...origen,
  obtenerSolicitudes: async () => masViejasPrimero(await origen.obtenerSolicitudes()),
}
