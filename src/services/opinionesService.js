import { getResenasLibroApi } from '../api/resenasApi'

export const getOpinionesVendedor = async (_tienda, publicaciones) => {
  const listas = await Promise.all(publicaciones.map(async (p) => (
    (await getResenasLibroApi(p.id).catch(() => [])).map((r) => ({ ...r, libro: p.t, clave: `${p.id}-${r.id}` }))
  )))
  return listas.flat().sort((a, b) => String(b.date).localeCompare(String(a.date)))
}
