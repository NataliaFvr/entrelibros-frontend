import { guardar, leer } from './almacen'

// Tarifas de envío guardadas en este navegador: costo fijo por vendedor, según si comparte provincia con quien compra.
// Back: GET /envios y POST /envios {zona: MISMA_PROVINCIA | DISTINTA_PROVINCIA, costoFijo}
const CLAVE = 'entrelibros_ship'
export const TARIFAS_INICIALES = { misma: 1800, distinta: 3500 }

const valido = (n) => Number.isFinite(n) && n > 0

// Siempre devuelve las dos tarifas; si lo guardado está roto, cae en el valor inicial
export const getTarifas = () => {
  const g = leer(CLAVE, null) || {}
  return {
    misma: valido(g.misma) ? g.misma : TARIFAS_INICIALES.misma,
    distinta: valido(g.distinta) ? g.distinta : TARIFAS_INICIALES.distinta,
  }
}

// Devuelve false si no hay espacio en el navegador
export const guardarTarifa = (tipo, costo) => guardar(CLAVE, { ...getTarifas(), [tipo]: costo })
