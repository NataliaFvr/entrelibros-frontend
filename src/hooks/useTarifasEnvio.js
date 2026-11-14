import { useEffect } from 'react'
import { fetchTarifas } from '../redux/enviosSlice'

const useTarifasEnvio = ({ dispatch, tarifas, cargada, error }) => {

  useEffect(() => {
    if (!cargada && !error) dispatch(fetchTarifas())
  }, [dispatch, cargada, error])

  return { ...tarifas, cargada }
}

export default useTarifasEnvio
