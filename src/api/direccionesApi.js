import api from './axiosConfig'
import { aDireccionFront } from '../utils/adaptadores'
import { guardar, leer } from '../services/almacen'
import { claveDirPrincipal } from '../services/claves'

// DireccionController (todas las rutas son del usuario logueado: el back lo saca del token).
//   GET    /direcciones      -> [{ id, alias, calle, ciudad, provincia, cp }]
//   POST   /direcciones      { alias, calle, ciudad, provincia, cp } -> 201 con la dirección creada
//   DELETE /direcciones/{id} -> { mensaje }
// El front usa `prov`; el back `provincia` (el mapeo vive en aDireccionFront / acá al enviar).

// El back todavía no tiene "dirección principal" (ni el campo ni PATCH /direcciones/{id}/principal).
// Hasta que lo tenga, la principal se recuerda en este navegador SOLO como un id (una preferencia, no un dato).
// Cuando el back lo sume: poner esto en true y las tarjetas empiezan a usar `principal` del servidor y el PATCH.
export const PRINCIPAL_EN_BACK = false

const leerPrincipal = (idUsuario) => leer(claveDirPrincipal(idUsuario), null)

// Regla única: exactamente una principal si hay direcciones. Gana la que ya viene marcada (back);
// si no, la recordada en este navegador; si no, la primera.
const resolverPrincipal = (lista, idUsuario) => {
  if (!lista.length) return lista
  const delBack = PRINCIPAL_EN_BACK ? lista.findIndex((d) => d.principal) : -1
  const recordada = lista.findIndex((d) => d.id === leerPrincipal(idUsuario))
  const i = [delBack, recordada, 0].find((n) => n >= 0)
  return lista.map((d, j) => ({ ...d, principal: j === i }))
}

export const listarDireccionesApi = async (idUsuario) => {
  let datos
  try {
    datos = (await api.get('/direcciones')).data
  } catch (err) {
    if (err.response && err.response.status === 404) datos = [] // ListaVaciaException: "sin direcciones" no es un error
    else throw err
  }
  return resolverPrincipal(datos.map(aDireccionFront), idUsuario)
}

export const crearDireccionApi = async ({ alias, calle, ciudad, prov, cp }) =>
  aDireccionFront((await api.post('/direcciones', { alias, calle, ciudad, provincia: prov, cp })).data)

export const eliminarDireccionApi = async (id) => (await api.delete(`/direcciones/${id}`)).data

export const marcarPrincipalApi = async (idUsuario, id) => {
  if (PRINCIPAL_EN_BACK) return (await api.patch(`/direcciones/${id}/principal`)).data
  guardar(claveDirPrincipal(idUsuario), id)
  return { mensaje: 'Dirección principal actualizada' }
}
