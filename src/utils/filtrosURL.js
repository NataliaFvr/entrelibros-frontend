import { FILTROS_INICIALES } from './filtrarLibros'

// Lee los filtros iniciales desde la URL: /libros?estado=&cat=&autor=&vendedor=&q=&desc=&sort=
export function filtrosDesdeURL(search, categorias) {
  const p = new URLSearchParams(search)
  const f = { ...FILTROS_INICIALES, cats: [], envios: [] }

  const estado = p.get('estado')
  if (estado === 'nuevos' || estado === 'usados') f.estado = estado

  const cat = p.get('cat')
  if (cat && categorias.includes(cat)) f.cats = [cat]

  f.autor = p.get('autor') || ''
  f.vendedor = p.get('vendedor') || ''
  f.q = p.get('q') || ''

  const desc = +p.get('desc')
  if (desc > 0) f.desc = desc

  const sort = p.get('sort')
  if (['best', 'new', 'asc', 'desc', 'disc'].includes(sort)) f.sort = sort

  return f
}
