import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { cerrarToast } from '../Redux/toastSlice'

// Aviso breve al pie de la pantalla. Lo abre mostrarToast (Redux/toastSlice.js) y se cierra solo.
const Toast = () => {
  const dispatch = useDispatch()
  const aviso = useSelector((state) => state.toast.aviso)

  return (
    <div className="toast" role="status" hidden={!aviso}>
      {aviso?.msg}
      {aviso?.accion && (
        <Link className="toast-a" to={aviso.accion.a} onClick={() => dispatch(cerrarToast())}>{aviso.accion.texto}</Link>
      )}
    </div>
  )
}

export default Toast