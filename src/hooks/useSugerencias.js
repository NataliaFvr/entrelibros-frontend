import { useMemo } from 'react'
import { norm } from '../utils/format'
import { ordenarPorVentas } from '../utils/filtrarLibros'
import { buscarTiendas } from '../utils/vendedor'

// Sugerencias del buscador: hasta 2 autores + 5 libros + 3 vendedores + "ver todos"
const useSugerencias = (libros, texto) => {
  return useMemo(() => {
    const q = norm(texto.trim())
    if (!q) return []

    const autores = [...new Set(libros.map((l) => l.a))].filter((a) => norm(a).includes(q)).slice(0, 2)
    const vistos = new Set()
    const libs = []
    for (const l of ordenarPorVentas(libros)) { // incluye usados: se pueden buscar, solo no son bestsellers
      const k = `${l.t}|${l.a}`
      if (libs.length < 5 && !vistos.has(k) && norm(`${l.t} ${l.a} ${l.ed}`).includes(q)) {
        vistos.add(k)
        libs.push(l)
      }
    }
    const tiendas = buscarTiendas(libros, texto).slice(0, 3)
    if (!autores.length && !libs.length && !tiendas.length) return []

    return [
      ...autores.map((a) => ({ tipo: 'autor', key: `a-${a}`, nombre: a })),
      ...libs.map((l) => ({ tipo: 'libro', key: `l-${l.id}`, libro: l })),
      ...tiendas.map((t) => ({ tipo: 'vendedor', key: `v-${t.tienda}`, ...t })),
      { tipo: 'todos', key: 'todos' },
    ]
  }, [libros, texto])
}

export default useSugerencias
