import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthHero from '../componentes/AuthHero'
import DemoBox from '../componentes/DemoBox'
import AuthTabs from '../componentes/AuthTabs'
import LoginForm from '../componentes/LoginForm'
import RegisterForm from '../componentes/RegisterForm'
import MiniDeco from '../componentes/MiniDeco'

// tab: 'login' | 'register'. Al entrar vuelve a la página desde la que se pidió la sesión.
const AuthPage = ({ tab }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [destinoDemo, setDestinoDemo] = useState(null) // ruta propia de la cuenta demo (ej. el vendedor va a /vender)
  const destino = destinoDemo || state?.from || '/cuenta'

  if (user) return <Navigate to={destino} replace />

  const irATab = (t) => navigate(t === 'login' ? '/ingresar' : '/registrarse', { replace: true, state })
  const listo = () => navigate(destino, { replace: true })
  const pendiente = () => navigate('/confirmar', { replace: true, state })

  return (
    <main className="usr">
      <AuthHero titulo="Bienvenido a Entrelibros" sub="Entrá o creá tu cuenta para guardar, comprar y opinar" />
      <div className="au-card">
        <DemoBox onElegirDestino={setDestinoDemo} />
        <div className="au-main">
          <AuthTabs tab={tab} onCambiar={irATab} />
          {tab === 'login'
            ? <LoginForm onListo={listo} onPendiente={pendiente} onIrARegistro={() => irATab('register')} />
            : <RegisterForm onPendiente={pendiente} onIrALogin={() => irATab('login')} />}
        </div>
      </div>
      <MiniDeco />
    </main>
  )
}

export default AuthPage
