import { norm } from './format'

// "Librería El Resplandor" -> "libreria-el-resplandor" (es el :id de /vendedor/:id)
export const slugVendedor = (tienda) => norm(tienda).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const rutaVendedor = (tienda) => `/vendedor/${slugVendedor(tienda)}`
