/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { esLibroPropio, libroEnRevision, rutaEdicion } from '../api/vendedorApi'

// ¿El libro es una publicación de la cuenta con sesión? Un vendedor no compra ni guarda lo suyo:
// en su lugar puede editarlo. Sin sesión (o sin ser vendedor) siempre da false.
const useLibroPropio = () => {
  const dispatch=useReduxDispatch()
  const {user}=useReduxSelector(s=>s.auth)
  return {
    esPropio: (libro) => esLibroPropio(user, libro),
    rutaEdicion: (libro) => rutaEdicion(user, libro),
    enRevision: (libro) => libroEnRevision(user, libro), // tiene cambios pendientes: no se puede volver a editar
  }
}

export default useLibroPropio
