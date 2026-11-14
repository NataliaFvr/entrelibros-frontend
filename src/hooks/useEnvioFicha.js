import { zonaEnvio } from '../utils/envio'

// Costo de envío para la ficha: la zona sale de la provincia del vendedor (viene en el libro) y la de la dirección
// principal del comprador. Sin dirección no se sabe la zona: se muestra la tarifa más barata ("desde").
const useEnvioFicha = (libro, { user, direcciones, tarifas }) => {
  const provincia = ((direcciones || []).find((d) => d.principal) || (direcciones || [])[0])?.prov || user?.provincia || ''

  const costos = [tarifas.misma, tarifas.distinta].filter((c) => c != null)
  if (!costos.length) return null
  if (provincia && libro.provV) {
    const zona = zonaEnvio(libro.provV, provincia)
    if (tarifas[zona] != null) return { provincia, costo: tarifas[zona], misma: zona === 'misma' }
  }
  return { desde: Math.min(...costos) }
}

export default useEnvioFicha
