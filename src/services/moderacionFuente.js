import { masViejasPrimero } from '../utils/ordenSolicitudes'
import * as api from './moderacionService'

const origen = api

export const fuenteModeracion = {
  ...origen,
  obtenerSolicitudes: async () => masViejasPrimero(await origen.obtenerSolicitudes()),
}
