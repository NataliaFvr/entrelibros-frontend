import { useAuth } from '../hooks/useAuth'
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
  const { direcciones, eliminarDireccion, marcarPrincipal } = useAuth()
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
