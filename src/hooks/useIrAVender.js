import { useNavigate } from 'react-router-dom'

const RUTA_VENDER = '/vender'

// "Vender" lo usan el menú de escritorio, el menú móvil y el footer.
// Sin sesión abre el modal de login (y, al entrar, lleva a /vender); con sesión navega directo.
const useIrAVender = ({ dispatch, user }) => {
  const navigate = useNavigate()

  const requiereLogin=(t,d=null,a=null)=>{if(user)return false;dispatch(abrirGate({tipo:t,destino:d,accion:a}));return true}
  return () => {
    if (!requiereLogin('sell', RUTA_VENDER)) navigate(RUTA_VENDER)
  }
}

export default useIrAVender
