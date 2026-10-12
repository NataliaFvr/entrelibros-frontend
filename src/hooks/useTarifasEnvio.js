import { useEffect, useState } from 'react'
import { listarTarifasEnvioApi } from '../api/enviosApi'

const useTarifasEnvio = () => {
  const [tarifas, setTarifas] = useState({})
  const [cargada, setCargada] = useState(false) // true cuando el back ya respondió (aunque no haya tarifas)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let vigente = true
    listarTarifasEnvioApi()
      .then((t) => { if (vigente) { setTarifas(t); setCargada(true) } })
      .catch(() => {})
    return () => { vigente = false }
  }, [version])

  const recargar = () => setVersion((v) => v + 1)
  return { ...tarifas, cargada, recargar }
}

export default useTarifasEnvio
