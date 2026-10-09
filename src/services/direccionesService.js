import { crearDireccionApi, eliminarDireccionApi, listarDireccionesApi, marcarPrincipalApi } from '../api/direccionesApi'

export const direcciones = {
  listar: (u) => listarDireccionesApi(u.id),
  crear: async (u, d) => { await crearDireccionApi(d); return listarDireccionesApi(u.id) },
  eliminar: async (u, id) => { await eliminarDireccionApi(id); return listarDireccionesApi(u.id) },
  marcarPrincipal: async (u, id) => { await marcarPrincipalApi(u.id, id); return listarDireccionesApi(u.id) },
}
