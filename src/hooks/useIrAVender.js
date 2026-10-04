import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

// "Vender" lo usan el menú de escritorio y el menú móvil: sin sesión abre el modal de login
const useIrAVender = () => {
  const navigate = useNavigate()
  const { requiereLogin } = useAuth()
  return () => {
    if (!requiereLogin('sell')) navigate('/vender')
  }
}

export default useIrAVender
