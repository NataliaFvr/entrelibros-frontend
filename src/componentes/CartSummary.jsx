import { useNavigate } from 'react-router-dom'
import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'
import AddressSelect from './AddressSelect'

// Resumen de la estantería + dirección de envío + botón para pasar al pago
const CartSummary = ({ sub, envio, direcciones, elegida, onElegir, onFinalizar }) => {
  const navigate = useNavigate()
  return (
    <div className="card csum">
      <h3 className="fr">Resumen</h3>
      <SummaryRow titulo="Libros" valor={fmt(sub)} />
      <SummaryRow titulo="Envío" valor={fmt(envio)} />
      <SummaryRow titulo="Total" valor={fmt(sub + envio)} total />
      {direcciones.length ? (
        <>
          <AddressSelect direcciones={direcciones} elegida={elegida} onElegir={onElegir} />
          <button className="btn main" type="button" onClick={onFinalizar}>Procesar compra de la estantería</button>
        </>
      ) : (
        <>
          <p className="note">Para comprar necesitás una dirección de envío.</p>
          <button className="btn main" type="button" onClick={() => navigate('/cuenta/direcciones')}>Agregar dirección</button>
        </>
      )}
    </div>
  )
}

export default CartSummary
