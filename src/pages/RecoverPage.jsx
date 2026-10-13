import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import AuthHero from '../componentes/AuthHero'
import MiniDeco from '../componentes/MiniDeco'
import RecoverForm from '../componentes/RecoverForm'

// /recuperar — "Olvidé mi contraseña": código por e-mail y contraseña nueva. Al terminar vuelve a /ingresar.
const RecoverPage = () => {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { state } = useLocation()

  if (user) return <Navigate to="/cuenta" replace />

  const volver = () => navigate('/ingresar', { replace: true, state })
  const listo = () => {
    toast('Contraseña actualizada. Ya podés ingresar con la nueva.')
    volver()
  }

  return (
    <main className="usr au-page">
      <AuthHero titulo="Recuperá tu contraseña" sub="Te mandamos un código por e-mail para elegir una nueva" />
      <div className="au-card">
        <div className="au-main">
          <RecoverForm emailInicial={state?.email || ''} onListo={listo} onVolver={volver} />
        </div>
      </div>
      <MiniDeco />
    </main>
  )
}

export default RecoverPage
