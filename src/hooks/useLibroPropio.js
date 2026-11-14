/* oxlint-disable no-unused-vars */
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { esLibroPropio, libroEnRevision, rutaEdicion } from '../api/vendedorApi'

// ¿El libro es una publicación de la cuenta con sesión? Un vendedor no compra ni guarda lo suyo:
// en su lugar puede editarlo. Sin sesión (o sin ser vendedor) siempre da false.
const useLibroPropio = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.user)
  return {
    esPropio: (libro) => esLibroPropio(user, libro),
    rutaEdicion: (libro) => rutaEdicion(user, libro),
    enRevision: (libro) => libroEnRevision(user, libro), // tiene cambios pendientes: no se puede volver a editar
  }
}

export default useLibroPropio
