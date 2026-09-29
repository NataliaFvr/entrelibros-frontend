import { useAuth } from '../hooks/useAuth'
import AddressCard from './AddressCard'
import EmptyBlock from './EmptyBlock'

const AddressList = () => {
  const { direcciones, eliminarDireccion } = useAuth()

  if (!direcciones.length) return <EmptyBlock titulo="No tenés direcciones" texto="Agregá una para poder comprar." />

  return (
    <div>
      {direcciones.map((d, i) => <AddressCard key={i} direccion={d} onEliminar={() => eliminarDireccion(i)} />)}
    </div>
  )
}

export default AddressList
