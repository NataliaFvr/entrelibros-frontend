/* oxlint-disable no-unused-vars */
import {mostrarToast} from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/authSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import useLibroPropio from '../hooks/useLibroPropio'
import EmptyBlock from './EmptyBlock'
import SavedBook from './SavedBook'

// Pestaña Marcapáginas: los libros guardados, en el orden en que se guardaron
const SavedBooks = () => {
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const {marks}=useSelector(s=>s.auth)
  const toggleMark=async(i)=>{const estaba=marks.includes(i);const r=await dispatch(toggleMarkThunk({id:i,estaba}));if(r.error)toast(r.error.message)}
  const toast=(msg,accion)=>dispatch(mostrarToast({msg,accion}))
  const { agregar } = useCompra()
  const { libros } = useLibros()
  const { esPropio } = useLibroPropio()

  const guardados = marks.map((id) => libros.find((l) => l.id === id)).filter(Boolean)

  if (!guardados.length) {
    return (
      <EmptyBlock titulo="Tu Marcapáginas está vacío" texto="Guardá libros con el botón de cada ficha para encontrarlos acá."
        boton="Ver libros" onClick={() => navigate('/libros')} />
    )
  }

  return (
    <div className="grid">
      {guardados.map((l) => (
        <SavedBook key={l.id} libro={l} propio={esPropio(l)} onAlCarrito={() => agregar(l)} onQuitar={() => toggleMark(l.id)} />
      ))}
    </div>
  )
}

export default SavedBooks
