import { USAR_API_LIBROS } from '../utils/modoApi'
import * as api from './moderacionService'
import * as demo from './moderacionDemo'

// Origen de la cola de moderación: el back si VITE_API_LIBROS=true, si no los datos de demostración.
// Lo usan el panel de moderación y el resumen del administrador, para que ambos cuenten lo mismo.
export const fuenteModeracion = USAR_API_LIBROS ? api : demo
