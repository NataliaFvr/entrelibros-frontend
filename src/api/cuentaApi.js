import api from './axiosConfig'
import { traerPaginas } from './librosApi'
import { aNotificacionFront } from '../utils/adaptadores'

// NotificacionController, MarcapaginaController y ContactoController

export const listarNotificacionesApi = async () => (await traerPaginas('/notificaciones')).map(aNotificacionFront)
// El back solo sabe marcar TODAS como leídas (no hay PATCH por id ni DELETE)
export const marcarTodasLeidasApi = async () => (await api.patch('/notificaciones/marcar-leidas')).data

// GET /marcapaginas -> Page<{ id, fechaGuardado, libro }>: el front guarda solo los ids de los libros
export const listarMarcapaginasApi = async () => (await traerPaginas('/marcapaginas')).map((m) => m.libro && m.libro.id).filter((id) => id != null)
export const agregarMarcapaginaApi = async (idLibro) => (await api.post('/marcapaginas', { idLibro })).data
export const quitarMarcapaginaApi = async (idLibro) => (await api.delete(`/marcapaginas/${idLibro}`)).data

// POST /contacto { nombre, email, mensaje } (público)
export const enviarContactoApi = async ({ nombre, email, mensaje }) => (await api.post('/contacto', { nombre, email, mensaje })).data
