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
  // Guardar en el back y en el estado a la vez: con la tarifa que devolvió el PATCH o el POST
  // ({ id, zona: 'misma' | 'distinta', costoFijo }) se actualiza el estado, sin volver a pedir la lista con GET.
  const aplicar = (tarifa) => setTarifas((t) => ({
    ...t,
    [tarifa.zona]: tarifa.costoFijo,
    ids: { ...t.ids, [tarifa.zona]: tarifa.id },
  }))
  return { ...tarifas, cargada, recargar, aplicar }
}

export default useTarifasEnvio