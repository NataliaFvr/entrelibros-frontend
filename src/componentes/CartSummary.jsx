import { useState } from 'react'
import { fmt } from '../utils/format'
import SummaryRow from './SummaryRow'
import AddressSelect from './AddressSelect'
import AddressForm from './AddressForm'

// Resumen de la estantería + dirección de envío + botón para pasar al pago.
// `envio` puede ser null: todavía no se conoce (el back lo calcula según la zona de la dirección elegida).
const CartSummary = ({ sub, envio, direcciones, elegida, onElegir, onFinalizar, enviando = false }) => {
  const [agregando, setAgregando] = useState(false) // formulario de nueva dirección abierto (si ya hay direcciones)
  return (
    <div className="card csum">
      <h3 className="fr">Resumen</h3>
      <SummaryRow titulo="Libros" valor={fmt(sub)} />
      <SummaryRow titulo="Envío" valor={envio == null ? 'A calcular' : fmt(envio)} />
      <SummaryRow titulo="Total" valor={fmt(sub + (envio ?? 0))} total />
      {direcciones.length ? (
        <>
          <AddressSelect direcciones={direcciones} elegida={elegida} onElegir={onElegir} />
          {agregando ? (
            // La dirección nueva queda seleccionada (se agrega al final de la lista)
            <AddressForm embebido onGuardada={() => { setAgregando(false); onElegir(direcciones.length) }} />
          ) : (
            <button className="lnk" type="button" onClick={() => setAgregando(true)}>+ Agregar otra dirección</button>
          )}
          <button className="btn main" type="button" onClick={onFinalizar} disabled={enviando}>
            {enviando ? 'Procesando…' : 'Procesar compra de la estantería'}
          </button>
        </>
      ) : (
        <>
          <p className="note">Para comprar necesitás una dirección de envío. Agregala acá y seguí con tu compra.</p>
          <AddressForm embebido onGuardada={() => onElegir(0)} />
        </>
      )}
    </div>
  )
}

export default CartSummary
