import { useNavigate } from 'react-router-dom'
import { abrirGate } from '../redux/userSlice'

const RUTA_VENDER = '/vender'

// "Vender" lo usan el menú de escritorio, el menú móvil y el footer.
// Sin sesión abre el modal de login (y, al entrar, lleva a /vender); con sesión navega directo.
const useIrAVender = ({ dispatch, user }) => {
  const navigate = useNavigate()

  return () => {
    if (!user) {
      dispatch(abrirGate({ tipo: 'sell', destino: RUTA_VENDER, accion: null }))
      return
    }
    navigate(RUTA_VENDER)
  }
}

export default useIrAVender