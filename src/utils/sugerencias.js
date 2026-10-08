import { norm } from './format'

// Sugerencias para campos de texto libres (editorial, autor) con lo que ya existe en el catálogo, así dos vendedores
// que venden "Estrada" no terminan con "estrada", "Editorial Estrada " y "ESTRADA" como si fueran tres editoriales.

// Clave de comparación: sin tildes, sin mayúsculas, sin espacios de más
export const clave = (s) => norm(s).replace(/\s+/g, ' ').trim()

// Valores distintos de `campo` ('ed' | 'a') en `libros`, agrupados por clave. De cada grupo se queda con la grafía más usada
// (la "canónica"). Devuelve [{ nombre, total }] ordenado por cantidad de libros y, a igualdad, alfabéticamente.
export const valoresFrecuentes = (libros, campo) => {
  const grupos = new Map() // clave -> Map(grafía -> cantidad)
  libros.forEach((l) => {
    const valor = String(l[campo] || '').replace(/\s+/g, ' ').trim()
    if (!valor) return
    const k = clave(valor)
    if (!grupos.has(k)) grupos.set(k, new Map())
    const grafias = grupos.get(k)
    grafias.set(valor, (grafias.get(valor) || 0) + 1)
  })
  const lista = [...grupos.values()].map((grafias) => {
    const ordenadas = [...grafias].sort((a, b) => b[1] - a[1])
    return { nombre: ordenadas[0][0], total: ordenadas.reduce((s, [, n]) => s + n, 0) }
  })
  return lista.sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'))
}

// Las que coinciden con lo escrito: primero las que EMPIEZAN igual y después las que lo contienen. Si no hay nada escrito
// devuelve las más usadas. Si lo escrito ya es exactamente una de ellas, no hay nada que sugerir. Respeta `minimo` letras.
export const filtrarSugerencias = (lista, texto, { minimo = 0, maximo = 6 } = {}) => {
  const k = clave(texto)
  if (k.length < minimo) return []
  if (!k) return lista.slice(0, maximo)
  const empiezan = []
  const contienen = []
  lista.forEach((s) => {
    const ks = clave(s.nombre)
    if (ks === k) return
    if (ks.startsWith(k)) empiezan.push(s)
    else if (ks.includes(k)) contienen.push(s)
  })
  return [...empiezan, ...contienen].slice(0, maximo)
}

// Si lo escrito es una de las existentes (ignorando mayúsculas, tildes y espacios), devuelve la grafía canónica;
// si no, el texto con los espacios normalizados.
export const canonico = (lista, texto) => {
  const limpio = String(texto || '').replace(/\s+/g, ' ').trim()
  const hallada = lista.find((s) => clave(s.nombre) === clave(limpio))
  return hallada ? hallada.nombre : limpio
}
