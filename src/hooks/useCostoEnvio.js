import { costoEnvio } from '../utils/envio'
import { tipoEnvio } from '../utils/adaptadores'
import { USAR_API } from '../utils/modoApi'
import useTarifasEnvio from './useTarifasEnvio'

// Costo de envío que se muestra en la estantería ANTES de confirmar. Devuelve un número o null (todavía no se puede calcular).
// El valor definitivo es siempre el `costoEnvio` de la orden que devuelve el back al confirmar (pedido.env).
// Las dos versiones cobran un envío por vendedor: misma o distinta provincia que quien compra.

const useCostoEnvioDemo = (precios, libros) => costoEnvio(precios, libros)

const useCostoEnvioApi = (precios, libros, direccion) => {
  const tarifas = useTarifasEnvio()
  if (!direccion || tarifas.misma == null || tarifas.distinta == null) return null
  const provinciaPorVendedor = new Map()
  precios.forEach((i) => {
    const l = libros.find((x) => x.id === i.id)
    if (l && !provinciaPorVendedor.has(l.vId)) provinciaPorVendedor.set(l.vId, l.provV)
  })
  return [...provinciaPorVendedor.values()]
    .reduce((suma, provV) => suma + tarifas[tipoEnvio(provV, direccion.prov)], 0)
}

const useCostoEnvio = USAR_API ? useCostoEnvioApi : useCostoEnvioDemo

export default useCostoEnvio
