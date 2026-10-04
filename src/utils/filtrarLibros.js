import { norm } from './format'
import { esUsado } from './libro'

export const PAGE_SIZE = 12
export const PRECIO_MAX = 500

export const FILTROS_INICIALES = {
  estado: 'ambos', cats: [], envios: [], min: 0, max: PRECIO_MAX, desc: 0,
  ed: '', autor: '', idioma: '', anio: '', vendedor: '', q: '', sort: 'best', page: 1,
}

const porVentas = (a, b) => b.ventas - a.ventas
// Orden "Bestsellers" del catálogo: primero los nuevos por ventas; los usados (piezas únicas) quedan al final
const porBestsellers = (a, b) => Number(esUsado(a)) - Number(esUsado(b)) || porVentas(a, b)

const ORDEN = {
  best: porBestsellers,
  new: (a, b) => b.anio - a.anio,
  asc: (a, b) => a.p - b.p,
  desc: (a, b) => b.p - a.p,
  disc: (a, b) => b.d - a.d,
}

// Filtra y ordena en el front. Cuando el back pagine/filtre, esto se reemplaza por GET /libros?...
export function filtrarLibros(libros, f) {
  const r = libros.filter((l) =>
    (f.estado === 'ambos' || (f.estado === 'usados') === esUsado(l)) &&
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

// Ranking de bestsellers: solo libros nuevos. Un usado es una pieza única de un vendedor, no una obra "más vendida".
export const masVendidos = (libros) => libros.filter((l) => !esUsado(l)).sort(porVentas)

// Todos los libros (nuevos y usados) ordenados por ventas, con los nuevos primero. Para listados que no son el ranking.
export const ordenarPorVentas = (libros) => [...libros].sort(porBestsellers)

// Posición del libro en el ranking de bestsellers (1 = el más vendido). 0 = no participa (usado o sin ventas registradas).
export const posicionBestseller = (libros, libro) => (esUsado(libro) ? 0 : masVendidos(libros).findIndex((x) => x.id === libro.id) + 1)
