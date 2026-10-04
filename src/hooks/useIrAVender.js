import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

const RUTA_VENDER = '/vender'

// "Vender" lo usan el menú de escritorio, el menú móvil y el footer.
// Sin sesión abre el modal de login (y, al entrar, lleva a /vender); con sesión navega directo.
const useIrAVender = () => {
  const navigate = useNavigate()
  const { requiereLogin } = useAuth()
  return () => {
    if (!requiereLogin('sell', RUTA_VENDER)) navigate(RUTA_VENDER)
  }
}

export default useIrAVender
