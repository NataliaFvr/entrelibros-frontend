import { norm } from './format'

// "Librería El Resplandor" -> "libreria-el-resplandor" (es el :id de /vendedor/:id)
export const slugVendedor = (tienda) => norm(tienda).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const rutaVendedor = (tienda, id = null) => `/vendedor/${id ?? slugVendedor(tienda)}`

// Tiendas del catálogo cuyo nombre contiene `texto` (sin tildes ni mayúsculas), con su cantidad de libros.
// Las que más libros tienen van primero. Back: GET /vendedores?q=
export const buscarTiendas = (libros, texto) => {
  const q = norm(texto.trim())
  if (!q) return []
  const tiendas = new Map() // por id de vendedor si el catálogo lo trae (dos vendedores pueden llamarse igual)
  libros.forEach((l) => {
    if (!l.v) return
    const clave = l.vId ?? l.v
    const t = tiendas.get(clave) || { tienda: l.v, id: l.vId ?? null, cantidad: 0 }
    t.cantidad += 1
    tiendas.set(clave, t)
  })
  return [...tiendas.values()]
    .filter(({ tienda }) => norm(tienda).includes(q))
    .sort((a, b) => b.cantidad - a.cantidad || a.tienda.localeCompare(b.tienda))
}
