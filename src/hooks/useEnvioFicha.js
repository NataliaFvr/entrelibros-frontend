import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getLibroApi } from '../api/librosApi'
import useTarifasEnvio from './useTarifasEnvio'

// Costo de envío para la ficha. La zona (misma o distinta provincia) la decide el back con la provincia de la
// dirección principal del comprador, y el costo sale de las tarifas que carga el admin (GET /envios).
// Sin dirección no se sabe la zona: se muestra la tarifa más barata ("desde").
const useEnvioFicha = (idLibro) => {
  const { user, direcciones } = useAuth()
  const tarifas = useTarifasEnvio()
  const provincia = ((direcciones || []).find((d) => d.principal) || (direcciones || [])[0])?.prov || user?.provincia || ''
  const [zona, setZona] = useState({ clave: '', valor: null })
  const clave = `${idLibro}|${provincia}`

  useEffect(() => {
    if (!provincia) return undefined
    let vigente = true
    getLibroApi(idLibro, provincia)
      .then((l) => { if (vigente) setZona({ clave, valor: l.envio }) })
      .catch(() => {})
    return () => { vigente = false }
  }, [idLibro, provincia, clave])

  const costos = [tarifas.misma, tarifas.distinta].filter((c) => c != null)
  if (!costos.length) return null
  if (provincia && zona.clave === clave && tarifas[zona.valor] != null) {
    return { provincia, costo: tarifas[zona.valor], misma: zona.valor === 'misma' }
  }
  return { desde: Math.min(...costos) }
}

export default useEnvioFicha
