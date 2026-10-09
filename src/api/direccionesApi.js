import api from './axiosConfig'
import { aDireccionFront } from './adaptadores'
import { esListaVacia } from '../utils/errorApi'

// DireccionController (todas las rutas son del usuario logueado: el back lo saca del token).
//   GET    /direcciones      -> [{ id, alias, calle, ciudad, provincia, cp }]
//   POST   /direcciones      { alias, calle, ciudad, provincia, cp } -> 201 con la dirección creada
//   DELETE /direcciones/{id} -> { mensaje }
// El front usa `prov`; el back `provincia` (el mapeo vive en aDireccionFront / acá al enviar).

// El backend persiste la dirección principal y devuelve el campo `principal`.
const resolverPrincipal = (lista) => {
  if (!lista.length) return lista
  const i = Math.max(0, lista.findIndex((d) => d.principal))
  return lista.map((d, j) => ({ ...d, principal: j === i }))
}

export const listarDireccionesApi = async () => {
  let datos
  try {
    datos = (await api.get('/direcciones')).data
  } catch (err) {
    if (esListaVacia(err)) datos = [] // ListaVaciaException: "sin direcciones" no es un error
    else throw err
  }
  return resolverPrincipal(datos.map(aDireccionFront))
}

export const crearDireccionApi = async ({ alias, calle, ciudad, prov, cp }) =>
  aDireccionFront((await api.post('/direcciones', { alias, calle, ciudad, provincia: prov, cp })).data)

export const eliminarDireccionApi = async (id) => (await api.delete(`/direcciones/${id}`)).data

export const marcarPrincipalApi = async (id) => (await api.patch(`/direcciones/${id}/principal`)).data
