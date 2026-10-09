import { useEffect, useState } from 'react'
import { listarTarifasEnvioApi } from '../api/enviosApi'

const useTarifasEnvio = () => {
  const [tarifas, setTarifas] = useState({})
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let vigente = true
    listarTarifasEnvioApi().then((t) => { if (vigente) setTarifas(t) }).catch(() => {})
    return () => { vigente = false }
  }, [version])

  const recargar = () => setVersion((v) => v + 1)
  return { ...tarifas, recargar }
}

export default useTarifasEnvio
