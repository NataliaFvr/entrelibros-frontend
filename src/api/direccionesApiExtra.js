import { crearDireccionApi, eliminarDireccionApi, listarDireccionesApi, marcarPrincipalApi } from './direccionesApi'

export const direcciones = {
  listar: () => listarDireccionesApi(),
  crear: async (_u, d) => { await crearDireccionApi(d); return listarDireccionesApi() },
  eliminar: async (_u, id) => { await eliminarDireccionApi(id); return listarDireccionesApi() },
  marcarPrincipal: async (_u, id) => { await marcarPrincipalApi(id); return listarDireccionesApi() },
}
