import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthHero from '../componentes/AuthHero'
import MailSim from '../componentes/MailSim'
import VerifyForm from '../componentes/VerifyForm'
import MiniDeco from '../componentes/MiniDeco'

// Confirmación del e-mail con código de 6 dígitos. Al confirmar, entra y vuelve a donde estaba.
const VerifyPage = () => {
  const { user, verificacion } = useAuth()
  const { state } = useLocation()

  if (user) return <Navigate to={state?.from || '/cuenta'} replace />
  if (!verificacion.usuario) return <Navigate to="/ingresar" replace state={state} />

  return (
    <main className="usr">
      <AuthHero titulo="Confirmá tu cuenta" sub="Un último paso antes de empezar a leer" />
      <div className="au-card">
        <MailSim usuario={verificacion.usuario} onConfirmarDesdeMail={verificacion.confirmarDesdeMail} />
        <div className="au-main">
          <VerifyForm usuario={verificacion.usuario} nota={verificacion.nota} onConfirmar={verificacion.confirmar}
            onReenviar={verificacion.reenviar} onVolver={verificacion.cancelar} />
        </div>
      </div>
      <MiniDeco />
    </main>
  )
}

export default VerifyPage
