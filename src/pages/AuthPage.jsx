import { useSelector } from 'react-redux'
import { selectUser } from '../redux/selectores'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthHero from '../componentes/auth/AuthHero'
import AuthTabs from '../componentes/auth/AuthTabs'
import LoginForm from '../componentes/auth/LoginForm'
import MiniDeco from '../componentes/comun/MiniDeco'
import RegisterForm from '../componentes/auth/RegisterForm'

// tab: 'login' | 'register'. Al entrar vuelve a la página desde la que se pidió la sesión.
const AuthPage = ({ tab }) => {
  const user = useSelector(selectUser)
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