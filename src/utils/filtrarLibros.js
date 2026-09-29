import { norm } from './format'

export const PAGE_SIZE = 12
export const PRECIO_MAX = 500

export const FILTROS_INICIALES = {
  estado: 'ambos', cats: [], envios: [], min: 0, max: PRECIO_MAX, desc: 0,
  ed: '', autor: '', idioma: '', anio: '', vendedor: '', q: '', sort: 'best', page: 1,
}

const ORDEN = {
  best: (a, b) => b.ventas - a.ventas,
  new: (a, b) => b.anio - a.anio,
  asc: (a, b) => a.p - b.p,
  desc: (a, b) => b.p - a.p,
  disc: (a, b) => b.d - a.d,
}

// Filtra y ordena en el front. Cuando el back pagine/filtre, esto se reemplaza por GET /libros?...
export function filtrarLibros(libros, f) {
  const r = libros.filter((l) =>
    (f.estado === 'ambos' || (f.estado === 'usados') === l.usado) &&
    (!f.cats.length || f.cats.includes(l.cat)) &&
    (f.envios.length !== 1 || f.envios[0] === l.envio) &&
    l.p >= f.min && l.p <= f.max &&
    (f.desc === 0 || (f.desc === 1 ? l.d > 0 : l.d >= f.desc)) &&
    (!f.ed || l.ed === f.ed) && (!f.autor || l.a === f.autor) &&
    (!f.idioma || l.idioma === f.idioma) && (!f.vendedor || l.v === f.vendedor) &&
    (f.anio === '' || (f.anio === '0' ? l.anio < 2000 : l.anio >= +f.anio)) &&
    (!f.q || norm(`${l.t} ${l.a} ${l.ed} ${l.cat}`).includes(norm(f.q))))
  return r.sort(ORDEN[f.sort])
}

export const masVendidos = (libros) => [...libros].sort((a, b) => b.ventas - a.ventas)
