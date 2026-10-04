import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import { useToast } from '../hooks/useToast'
import useFormulario from '../hooks/useFormulario'
import useProcesoPago from '../hooks/useProcesoPago'
import { estadoPago } from '../utils/pedidos'
import Stepper from '../componentes/Stepper'
import EmptyBlock from '../componentes/EmptyBlock'
import PayForm from '../componentes/PayForm'
import OrderSummary from '../componentes/OrderSummary'
import PayProcessing from '../componentes/PayProcessing'
import PayApproved from '../componentes/PayApproved'
import PayFailed from '../componentes/PayFailed'

const Migas = () => (
  <div className="crumbs"><Link to="/">Inicio</Link> › <Link to="/carrito">Mi Estantería de Lectura</Link> › <span>Pago</span></div>
)

// /pago/:n — pasarela simulada. Back: POST /pagos {idOrden, proveedor}
const PayPage = () => {
  const { n } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const { pedidos, pagarPedido, cancelarPedido } = useCompra()
  const { libros } = useLibros()
  const [error, setError] = useState('')
  const form = useFormulario({ pm: 'tarjeta', sim: 'APROBADO', numero: '', titular: '', venc: '', cvv: '' })
  const { procesando, nota, pagar } = useProcesoPago((proveedor) => {
    pagarPedido(n, proveedor)
    toast('¡Pago aprobado!')
  })

  if (!user) return <Navigate to="/ingresar" replace state={{ from: `/pago/${n}` }} />

  const pedido = pedidos.find((p) => p.n === n)
  const verCompras = () => navigate('/cuenta/compras')

  if (!pedido) {
    return (
      <main className="usr">
        <Migas />
        <EmptyBlock titulo="No encontramos ese pedido" texto="Revisá tu historial de compras." boton="Ver mis compras" onClick={verCompras} />
      </main>
    )
  }

  const estado = estadoPago(pedido)

  if (procesando) return <main className="usr"><Migas /><Stepper actual={1} /><PayProcessing /></main>
  if (estado === 'SIMULADO_APROBADO') {
    return (
      <main className="usr">
        <Migas /><Stepper actual={3} />
        <PayApproved pedido={pedido} libros={libros} onVerCompras={verCompras} onSeguir={() => navigate('/libros')} />
      </main>
    )
  }
  if (estado !== 'PENDIENTE') {
    return (
      <main className="usr">
        <Migas /><Stepper actual={1} />
        <PayFailed pedido={pedido} estado={estado} onCatalogo={() => navigate('/libros')} onVerCompras={verCompras} />
      </main>
    )
  }

  return (
    <main className="usr">
      <Migas /><Stepper actual={1} />
      <h1 className="fr cart-t">Pagá tu pedido</h1>
      <div className="cart-grid">
        <PayForm form={form} usuario={user} nota={nota} error={error} onError={setError} onPagar={pagar} />
        <OrderSummary pedido={pedido} libros={libros} error={error} onCancelar={() => cancelarPedido(pedido.n)} />
      </div>
    </main>
  )
}

export default PayPage
