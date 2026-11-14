/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import AuthHero from '../componentes/AuthHero'
import VerifyForm from '../componentes/VerifyForm'
import MiniDeco from '../componentes/MiniDeco'

// Confirmación del e-mail con código de 6 dígitos. Al confirmar, entra y vuelve a donde estaba.
const VerifyPage = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.user)
  const errorDe=r=>({error:r.error.message,tipo:r.error.tipo,campos:r.error.campos||{}})
  const verif=useSelector(s=>s.user.verif),verificacion={usuario:verif&&verif.cuenta,nota:verif?verif.nota:'',reenviar:async()=>{const r=await dispatch(reenviarCodigo({email:verif.id}));return r.error?errorDe(r):{}},confirmar:async(c)=>{const r=await dispatch(confirmarEmail({email:verif.id,codigo:c}));return r.error?errorDe(r):{}},cancelar:()=>dispatch(cancelarVerificacion())}
  const { state } = useLocation()

  if (user) return <Navigate to={state?.from || '/cuenta'} replace />
  if (!verificacion.usuario) return <Navigate to="/ingresar" replace state={state} />

  return (
    <main className="usr au-page">
      <AuthHero titulo="Confirmá tu cuenta" sub="Un último paso antes de empezar a leer" />
      <div className="au-card">
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
