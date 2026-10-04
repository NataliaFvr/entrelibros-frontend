import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { direccionTexto } from '../utils/format'
import { conPrincipal } from '../utils/direcciones'
import AddressCard from './AddressCard'
import EmptyBlock from './EmptyBlock'

// Grilla fluida: las tarjetas se reparten todo el ancho disponible
const AddressList = () => {
  const { direcciones, eliminarDireccion, marcarPrincipal } = useAuth()
  const { pedidos } = useCompra()

  if (!direcciones.length) return <EmptyBlock titulo="No tenés direcciones" texto="Agregá una para poder comprar." />

  return (
    <div className="addr-grid">
      {conPrincipal(direcciones).map((d, i) => (
        <AddressCard
          key={i}
          direccion={d}
          usos={pedidos.filter((p) => p.addr === direccionTexto(d)).length}
          onEliminar={() => eliminarDireccion(i)}
          onPrincipal={() => marcarPrincipal(i)}
        />
      ))}
    </div>
  )
}

export default AddressList
