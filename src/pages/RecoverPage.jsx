import { mostrarToast } from '../redux/toastSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../redux/selectores'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthHero from '../componentes/auth/AuthHero'
import MiniDeco from '../componentes/comun/MiniDeco'
import RecoverForm from '../componentes/auth/RecoverForm'

// /recuperar — "Olvidé mi contraseña": código por e-mail y contraseña nueva. Al terminar vuelve a /ingresar.
const RecoverPage = () => {
  const dispatch=useDispatch()
  const user = useSelector(selectUser)
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
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