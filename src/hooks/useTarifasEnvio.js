import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTarifas } from '../redux/enviosSlice'

const useTarifasEnvio = () => {
  const dispatch = useDispatch()
  const { tarifas, cargada, error } = useSelector((state) => state.envios)

  useEffect(() => {
    if (!cargada && !error) dispatch(fetchTarifas())
  }, [dispatch, cargada, error])

  return { ...tarifas, cargada }
}

export default useTarifasEnvio
