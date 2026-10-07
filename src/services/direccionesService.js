import { crearDireccionApi, eliminarDireccionApi, listarDireccionesApi, marcarPrincipalApi } from '../api/direccionesApi'
import { crearDireccionDemo, eliminarDireccionDemo, listarDireccionesDemo, marcarPrincipalDemo } from './direccionesDemo'
import { elegirFuente } from '../utils/modoApi'

// Pasarela de direcciones: AuthContext solo conoce esto. Cada función devuelve la lista RESULTANTE de direcciones del usuario
// [{ id, alias, calle, ciudad, prov, cp, principal }] (siempre exactamente una principal si hay alguna).
// Con el back: GET / POST / DELETE /direcciones (ver api/direccionesApi.js). Sin el back: direccionesDemo (localStorage).
const conBack = {
  listar: (u) => listarDireccionesApi(u.id),
  crear: async (u, d) => { await crearDireccionApi(d); return listarDireccionesApi(u.id) },
  eliminar: async (u, id) => { await eliminarDireccionApi(id); return listarDireccionesApi(u.id) },
  marcarPrincipal: async (u, id) => { await marcarPrincipalApi(u.id, id); return listarDireccionesApi(u.id) },
}

// DEMO-ONLY: al quitar el modo demo se borra esta constante y `elegirFuente`
const demo = {
  listar: async (u) => listarDireccionesDemo(u),
  crear: async (u, d) => crearDireccionDemo(u, d),
  eliminar: async (u, id) => eliminarDireccionDemo(u, id),
  marcarPrincipal: async (u, id) => marcarPrincipalDemo(u, id),
}

export const direcciones = elegirFuente(conBack, demo)
