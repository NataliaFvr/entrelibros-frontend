import { useEffect, useState } from 'react'
import { listarTarifasEnvioApi } from '../api/enviosApi'
import { getTarifas } from '../services/enviosService'
import { USAR_API } from '../utils/modoApi'

// Tarifas vigentes { misma, distinta }: del back (GET /envios) o, en modo demo, las guardadas en este navegador.
// `recargar` vuelve a pedirlas, por ejemplo después de que el admin cambia un precio.
const useTarifasEnvio = () => {
  const [tarifas, setTarifas] = useState(() => (USAR_API ? {} : getTarifas()))
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!USAR_API) return
    let vigente = true
    listarTarifasEnvioApi().then((t) => { if (vigente) setTarifas(t) }).catch(() => {})
    return () => { vigente = false }
  }, [version])

  const recargar = () => (USAR_API ? setVersion((v) => v + 1) : setTarifas(getTarifas()))
  return { ...tarifas, recargar }
}

export default useTarifasEnvio
