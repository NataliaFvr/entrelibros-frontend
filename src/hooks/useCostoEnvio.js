import { useEffect, useState } from 'react'
import { listarTarifasEnvioApi } from '../api/enviosApi'
import { zonaEnvioDe } from '../utils/adaptadores'
import { costoEnvio } from '../utils/envio'
import { USAR_API } from '../utils/modoApi'

// Costo de envío que se muestra en la estantería ANTES de confirmar. Devuelve un número o null (todavía no se puede calcular).
// El valor definitivo es siempre el `costoEnvio` de la orden que devuelve el back al confirmar (pedido.env).
//   - Con el back: un costo fijo por orden según la zona de la dirección elegida (GET /envios), igual que el checkout.
//   - Modo demo: tarifa por vendedor guardada en este navegador (utils/envio.js).

const useCostoEnvioDemo = (precios, libros) => costoEnvio(precios, libros)

const useCostoEnvioApi = (precios, libros, direccion) => {
  const [tarifas, setTarifas] = useState(null)
  useEffect(() => {
    let vigente = true
    listarTarifasEnvioApi().then((t) => { if (vigente) setTarifas(t) }).catch(() => {})
    return () => { vigente = false }
  }, [])
  if (!direccion || !tarifas) return null
  return tarifas[zonaEnvioDe(direccion.prov)] ?? null
}

const useCostoEnvio = USAR_API ? useCostoEnvioApi : useCostoEnvioDemo

export default useCostoEnvio
