import { VENDEDOR_PRUEBA } from '../data/vendedorPruebaMock'
import { slugVendedor } from '../utils/vendedor'
import { getUsuarios } from './authService'
import { getVendedor } from './vendedorService'

// Datos públicos de un vendedor a partir del :id de la URL (slug de la tienda).
// Devuelve { tienda, usuario?, ubicacion?, desde?, descripcion?, foto?, verificado } o null si no existe.
// Back: GET /vendedores/{id} (404 si no existe)
export const buscarVendedor = (slug, libros) => {
  if (slugVendedor(VENDEDOR_PRUEBA.tienda) === slug) return VENDEDOR_PRUEBA

  const cuenta = getUsuarios().map((u) => ({ u, v: getVendedor(u) }))
    .find(({ v }) => v.estado === 'aprobado' && slugVendedor(v.tienda) === slug)
  if (cuenta) return { tienda: cuenta.v.tienda, usuario: cuenta.u.nombreUsuario, ubicacion: cuenta.v.prov, verificado: true }

  // Vendedores de ejemplo del catálogo: existen mientras tengan libros publicados
  const libro = libros.find((l) => slugVendedor(l.v) === slug)
  return libro ? { tienda: libro.v, verificado: true } : null
}
