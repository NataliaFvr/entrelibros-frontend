import api from './axiosConfig'
import { aDireccionFront } from '../utils/adaptadores'

// DireccionController (todas las rutas son del usuario logueado: el back lo saca del token)
// El front usa `prov`; el back `provincia` (el mapeo vive en aDireccionFront / acá al enviar).

// GET /direcciones -> [{ id, alias, calle, ciudad, provincia, cp, principal }] con exactamente una principal
export const listarDireccionesApi = async () => (await api.get('/direcciones')).data.map(aDireccionFront)

// POST /direcciones { alias, calle, ciudad, provincia, cp } -> 201 con la dirección creada
export const crearDireccionApi = async ({ alias, calle, ciudad, prov, cp }) =>
  aDireccionFront((await api.post('/direcciones', { alias, calle, ciudad, provincia: prov, cp })).data)

// DELETE /direcciones/{id} -> { mensaje }
export const eliminarDireccionApi = async (id) => (await api.delete(`/direcciones/${id}`)).data

// PATCH /direcciones/{id}/principal -> deja a esa como principal y desmarca la anterior
export const marcarPrincipalApi = async (id) => (await api.patch(`/direcciones/${id}/principal`)).data
