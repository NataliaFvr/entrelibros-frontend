import useAhora from '../hooks/useAhora'
import { estadoPago } from '../utils/pedidos'

// Aviso en la estantería: al confirmar, los libros salen del carrito y quedan en una orden pendiente de pago.
// Si la persona vuelve a la estantería, le recuerda esa compra y la lleva a pagarla.
const AvisoCompraPendiente = ({ pedidos, onPagar }) => {
  const ahora = useAhora(30000)
  // Las órdenes vienen de la más nueva a la más vieja
  const pendientes = pedidos.filter((p) => estadoPago(p) === 'PENDIENTE' && (!p.venceEn || p.venceEn > ahora))
  if (!pendientes.length) return null
  const pedido = pendientes[0]
  const hasta = pedido.venceEn
    ? new Date(pedido.venceEn).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
  return (
    <div className="note aviso-pend" role="status">
      <span>
        <b>Tenés una compra sin pagar</b> (pedido {pedido.n}).
        {hasta && ` Te reservamos los libros hasta las ${hasta}.`}
        {pendientes.length > 1 && ` Y ${pendientes.length - 1} más en tu historial de compras.`}
      </span>
      <button className="btn main" type="button" onClick={() => onPagar(pedido.n)}>Pagar ahora</button>
    </div>
  )
}

export default AvisoCompraPendiente
