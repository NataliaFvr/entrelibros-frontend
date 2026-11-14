/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthHero from '../componentes/AuthHero'
import AuthTabs from '../componentes/AuthTabs'
import LoginForm from '../componentes/LoginForm'
import RegisterForm from '../componentes/RegisterForm'
import MiniDeco from '../componentes/MiniDeco'

// tab: 'login' | 'register'. Al entrar vuelve a la página desde la que se pidió la sesión.
const AuthPage = ({ tab }) => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.user)
  const navigate = useNavigate()
  const { state } = useLocation()
  const destino = state?.from || '/cuenta'

  if (user) return <Navigate to={destino} replace />

  const irATab = (t) => navigate(t === 'login' ? '/ingresar' : '/registrarse', { replace: true, state })
  const listo = () => navigate(destino, { replace: true })
  const olvide = (email) => navigate('/recuperar', { state: { ...state, email } })
  const pendiente = () => navigate('/confirmar', { replace: true, state })

  return (
    <main className="usr au-page">
      <AuthHero titulo="Bienvenido a Entrelibros" sub="Entrá o creá tu cuenta para guardar, comprar y opinar" />
      <div className="au-card">
        <div className="au-main">
          <AuthTabs tab={tab} onCambiar={irATab} />
          {tab === 'login'
            ? <LoginForm onListo={listo} onPendiente={pendiente} onIrARegistro={() => irATab('register')} onOlvide={olvide} />
            : <RegisterForm onPendiente={pendiente} onIrALogin={() => irATab('login')} />}
        </div>
      </div>
      <MiniDeco />
    </main>
  )
}

export default AuthPage
