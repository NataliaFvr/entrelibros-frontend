import { useMemo } from 'react'
import { norm } from '../utils/format'
import { masVendidos } from '../utils/filtrarLibros'

// Sugerencias del buscador: hasta 2 autores + 5 libros + "ver todos"
const useSugerencias = (libros, texto) => {
  return useMemo(() => {
    const q = norm(texto.trim())
    if (!q) return []

    const autores = [...new Set(libros.map((l) => l.a))].filter((a) => norm(a).includes(q)).slice(0, 2)
    const vistos = new Set()
    const libs = []
    for (const l of masVendidos(libros)) {
      const k = `${l.t}|${l.a}`
      if (libs.length < 5 && !vistos.has(k) && norm(`${l.t} ${l.a} ${l.ed}`).includes(q)) {
        vistos.add(k)
        libs.push(l)
      }
    }
    if (!autores.length && !libs.length) return []

    return [
      ...autores.map((a) => ({ tipo: 'autor', key: `a-${a}`, nombre: a })),
      ...libs.map((l) => ({ tipo: 'libro', key: `l-${l.id}`, libro: l })),
      { tipo: 'todos', key: 'todos' },
    ]
  }, [libros, texto])
}

export default useSugerencias
