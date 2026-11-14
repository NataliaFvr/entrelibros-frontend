import { useEffect } from 'react'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { fetchTarifas } from '../redux/enviosSlice'

const useTarifasEnvio = () => {
  const dispatch = useReduxDispatch()
  const { tarifas, cargada, error } = useReduxSelector((state) => state.envios)

  useEffect(() => {
    if (!cargada && !error) dispatch(fetchTarifas())
  }, [dispatch, cargada, error])

  return { ...tarifas, cargada }
}

export default useTarifasEnvio
