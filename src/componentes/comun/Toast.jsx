import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { cerrarToast } from '../../redux/toastSlice'

const DURACION = 2400
const DURACION_CON_ACCION = 4000 // con link se deja más tiempo para poder tocarlo

// Aviso breve al pie de la pantalla. Lo abre mostrarToast (redux/toastSlice.js) y se cierra solo.
const Toast = () => {
  const dispatch = useDispatch()
  const aviso = useSelector((state) => state.toast.aviso)

  // Cada aviso nuevo (id distinto) arranca su propio tiempo; si llega otro antes, el anterior se cancela
  useEffect(() => {
    if (!aviso) return
    const id = setTimeout(() => dispatch(cerrarToast(aviso.id)), aviso.accion ? DURACION_CON_ACCION : DURACION)
    return () => clearTimeout(id)
  }, [dispatch, aviso])

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