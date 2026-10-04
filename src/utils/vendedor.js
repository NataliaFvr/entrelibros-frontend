import { norm } from './format'

// "Librería El Resplandor" -> "libreria-el-resplandor" (es el :id de /vendedor/:id)
export const slugVendedor = (tienda) => norm(tienda).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const rutaVendedor = (tienda) => `/vendedor/${slugVendedor(tienda)}`

// Tiendas del catálogo cuyo nombre contiene `texto` (sin tildes ni mayúsculas), con su cantidad de libros.
// Las que más libros tienen van primero. Back: GET /vendedores?q=
export const buscarTiendas = (libros, texto) => {
  const q = norm(texto.trim())
  if (!q) return []
  const cantidades = new Map()
  libros.forEach((l) => { if (l.v) cantidades.set(l.v, (cantidades.get(l.v) || 0) + 1) })
  return [...cantidades]
    .filter(([tienda]) => norm(tienda).includes(q))
    .map(([tienda, cantidad]) => ({ tienda, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad || a.tienda.localeCompare(b.tienda))
}
