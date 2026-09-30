import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { direccionTexto } from '../utils/format'
import AddressCard from './AddressCard'
import EmptyBlock from './EmptyBlock'

const AddressList = () => {
  const { direcciones, eliminarDireccion } = useAuth()
  const { pedidos } = useCompra()

  if (!direcciones.length) return <EmptyBlock titulo="No tenés direcciones" texto="Agregá una para poder comprar." />

  return (
    <div>
      {direcciones.map((d, i) => <AddressCard key={i} direccion={d} usos={pedidos.filter((p) => p.addr === direccionTexto(d)).length} onEliminar={() => eliminarDireccion(i)} />)}
    </div>
  )
}

export default AddressList
