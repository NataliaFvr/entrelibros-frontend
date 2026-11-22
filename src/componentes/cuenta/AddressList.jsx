import {mostrarToast} from '../../redux/toastSlice'
import { eliminarDireccion as eliminarDireccionThunk,marcarPrincipal as marcarPrincipalThunk } from '../../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { selectDirecciones, selectCompra } from '../../redux/selectores'
import { useCompra } from '../../hooks/useCompra'
import { direccionTexto } from '../../utils/format'
import AddressCard from './AddressCard'
import EmptyBlock from '../comun/EmptyBlock'

// El pedido guarda la dirección copiada (calle, ciudad, CP, provincia).
const usaDireccion = (pedido, d) => (pedido.dest
  ? pedido.dest.calle === d.calle && pedido.dest.ciudad === d.ciudad && pedido.dest.cp === d.cp && pedido.dest.prov === d.prov
  : pedido.addr === direccionTexto(d))

// Grilla fluida: las tarjetas se reparten todo el ancho disponible
const AddressList = () => {
  const dispatch=useDispatch()
  const direcciones = useSelector(selectDirecciones)
  const eliminarDireccion=async(i)=>!((await dispatch(eliminarDireccionThunk(i))).error)
  const marcarPrincipal=async(i)=>{const r=await dispatch(marcarPrincipalThunk(i));if(!r.error)toast('Dirección principal actualizada');return !r.error}
  const toast=(msg,accion)=>dispatch(mostrarToast({msg,accion}))
  const compra = useSelector(selectCompra)
  const { pedidos } = useCompra({ dispatch, ...compra })

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