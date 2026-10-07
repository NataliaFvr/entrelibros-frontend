import { VENDEDOR_PRUEBA } from '../data/vendedorPruebaMock'
import { slugVendedor } from '../utils/vendedor'
import { getUsuarios } from './authService'
import { getVendedor } from './vendedorService'
import { USAR_API } from '../utils/modoApi'

// Datos públicos de un vendedor a partir del :id de la URL (slug de la tienda).
// Devuelve { tienda, usuario?, ubicacion?, desde?, descripcion?, foto?, verificado } o null si no existe.
// SOLO DEMO (el :id es el slug). Con el back el :id es numérico y lo resuelve hooks/useVendedorPublico.js (GET /vendedores/{id}).
export const buscarVendedor = (slug, libros) => {
  if (!USAR_API && slugVendedor(VENDEDOR_PRUEBA.tienda) === slug) return VENDEDOR_PRUEBA

  // El back no tiene GET /vendedores/{id}: con VITE_API=true el vendedor sale de los libros del catálogo (LibroResponse.nombreVendedor)
  const cuenta = USAR_API ? null : getUsuarios().map((u) => ({ u, v: getVendedor(u) }))
    .find(({ v }) => v.estado === 'aprobado' && slugVendedor(v.tienda) === slug)
  if (cuenta) return { tienda: cuenta.v.tienda, usuario: cuenta.u.nombreUsuario, ubicacion: cuenta.v.prov, verificado: true }

  // Vendedores de ejemplo del catálogo: existen mientras tengan libros publicados
  const libro = libros.find((l) => slugVendedor(l.v) === slug)
  return libro ? { tienda: libro.v, verificado: true } : null
}
