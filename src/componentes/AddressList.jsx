/* oxlint-disable no-unused-vars */
import {mostrarToast} from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { useCompra } from '../hooks/useCompra'
import { direccionTexto } from '../utils/format'
import AddressCard from './AddressCard'
import EmptyBlock from './EmptyBlock'

// El pedido guarda la dirección copiada (calle, ciudad, CP, provincia).
const usaDireccion = (pedido, d) => (pedido.dest
  ? pedido.dest.calle === d.calle && pedido.dest.ciudad === d.ciudad && pedido.dest.cp === d.cp && pedido.dest.prov === d.prov
  : pedido.addr === direccionTexto(d))

// Grilla fluida: las tarjetas se reparten todo el ancho disponible
const AddressList = () => {
  const dispatch=useDispatch()
  const {direcciones}=useSelector(s=>s.user)
  const eliminarDireccion=async(i)=>!((await dispatch(eliminarDireccionThunk(i))).error)
  const marcarPrincipal=async(i)=>{const r=await dispatch(marcarPrincipalThunk(i));if(!r.error)toast('Dirección principal actualizada');return !r.error}
  const toast=(msg,accion)=>dispatch(mostrarToast({msg,accion}))
  const { pedidos } = useCompra()

  if (!direcciones.length) return <EmptyBlock titulo="No tenés direcciones" texto="Agregá una para poder comprar." />

  return (
    <div className="addr-grid">
      {direcciones.map((d) => (
        <AddressCard
          key={d.id}
          direccion={d}
          usos={pedidos.filter((p) => usaDireccion(p, d)).length}
          onEliminar={() => eliminarDireccion(d.id)}
          onPrincipal={() => marcarPrincipal(d.id)}
        />
      ))}
    </div>
  )
}

export default AddressList
