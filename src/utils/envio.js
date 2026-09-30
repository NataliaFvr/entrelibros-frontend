// Costo fijo por vendedor: misma provincia o provincia distinta
export const COSTO_ENVIO = { misma: 1800, distinta: 3500 }

// Un envío por vendedor, aunque compres varios libros suyos: [{ vendedor, tipo, costo }]
export const envioPorVendedor = (items, libros) => {
  const porVendedor = new Map()
  items.forEach((i) => {
    const l = libros.find((x) => x.id === i.id)
    if (l && !porVendedor.has(l.v)) porVendedor.set(l.v, l.envio)
  })
  return [...porVendedor].map(([vendedor, tipo]) => ({ vendedor, tipo, costo: COSTO_ENVIO[tipo] }))
}

export const costoEnvio = (items, libros) =>
  envioPorVendedor(items, libros).reduce((suma, e) => suma + e.costo, 0)
