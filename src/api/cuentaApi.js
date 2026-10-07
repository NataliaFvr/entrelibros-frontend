import api from './axiosConfig'
import { traerPaginas } from './librosApi'
import { aNotificacionFront, idNotificacionApi } from '../utils/adaptadores'
import { esListaVacia } from '../utils/errorApi'

// NotificacionController, MarcapaginaController y ContactoController

export const listarNotificacionesApi = async () => (await traerPaginas('/notificaciones')).map(aNotificacionFront)
// Solo la primera página (las más nuevas primero): alcanza para el desplegable de la campanita. 404 ListaVacia = sin notificaciones.
export const listarPrimeraPaginaNotificacionesApi = async (size = 20) => {
  try {
    const { data } = await api.get('/notificaciones', { params: { page: 0, size } })
    return (data.content || []).map(aNotificacionFront)
  } catch (err) {
    if (esListaVacia(err)) return []
    throw err
  }
}
// Se gestionan por id: PATCH /notificaciones/{id}/leida y DELETE /notificaciones/{id} (solo las propias).
// PATCH /notificaciones/marcar-leidas marca todas; GET /notificaciones/no-leidas/cantidad devuelve { cantidad } (0 si no hay).
export const marcarLeidaApi = async (id) => aNotificacionFront((await api.patch(`/notificaciones/${idNotificacionApi(id)}/leida`)).data)
export const eliminarNotificacionApi = async (id) => (await api.delete(`/notificaciones/${idNotificacionApi(id)}`)).data
export const cantidadNoLeidasApi = async () => (await api.get('/notificaciones/no-leidas/cantidad')).data.cantidad
export const marcarTodasLeidasApi = async () => (await api.patch('/notificaciones/marcar-leidas')).data

// GET /marcapaginas -> Page<{ id, fechaGuardado, libro }>: el front guarda solo los ids de los libros
export const listarMarcapaginasApi = async () => (await traerPaginas('/marcapaginas')).map((m) => m.libro && m.libro.id).filter((id) => id != null)
export const agregarMarcapaginaApi = async (idLibro) => (await api.post('/marcapaginas', { idLibro })).data
export const quitarMarcapaginaApi = async (idLibro) => (await api.delete(`/marcapaginas/${idLibro}`)).data

// POST /contacto { nombre, email, mensaje } (público)
export const enviarContactoApi = async ({ nombre, email, mensaje }) => (await api.post('/contacto', { nombre, email, mensaje })).data
