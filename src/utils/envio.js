import { getTarifas } from '../services/enviosService'

// Costo fijo por vendedor: misma provincia o provincia distinta. Lo define el administrador (Tarifas de envío),
// por eso se lee de lo guardado cada vez que se consulta y no queda fijo al cargar la app.
export const COSTO_ENVIO = {
  get misma() { return getTarifas().misma },
  get distinta() { return getTarifas().distinta },
}

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
