import { useEffect, useState } from 'react'
import { cotizarEnvioApi } from '../api/carritoApi'

// Costo de envío y total del carrito para la dirección elegida, antes de confirmar la compra.
// Se vuelve a pedir cuando cambia la dirección o el carrito (`clave` resume libros y cantidades).
const useCotizacionEnvio = (idDireccion, clave) => {
  const [cotizacion, setCotizacion] = useState(null)

  useEffect(() => {
    if (idDireccion == null || !clave) {
      setCotizacion(null)
      return undefined
    }
    let vigente = true
    cotizarEnvioApi(idDireccion)
      .then((c) => { if (vigente) setCotizacion(c) })
      .catch(() => { if (vigente) setCotizacion(null) })
    return () => { vigente = false }
  }, [idDireccion, clave])

  return cotizacion
}

export default useCotizacionEnvio
