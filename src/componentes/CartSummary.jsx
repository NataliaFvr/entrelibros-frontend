import { useState } from 'react'
import { fmt, plural } from '../utils/format'
import SummaryRow from './SummaryRow'
import AddressSelect from './AddressSelect'
import AddressForm from './AddressForm'

// Resumen de la estantería + dirección de envío + botón para pasar al pago.
// `cotizacion` = { costoEnvio, total, cantidadEnvios, envios } que calcula el back para la dirección elegida (null si todavía no llegó).
// `envios` = [{ idVendedor, vendedor, zona: 'misma' | 'distinta', costo }]: un envío por vendedor.
const CartSummary = ({ sub, cotizacion, direcciones, elegida, onElegir, onFinalizar, enviando = false }) => {
  const [agregando, setAgregando] = useState(false) // formulario de nueva dirección abierto (si ya hay direcciones)
  return (
    <div className="card csum">
      <h3 className="fr">Resumen</h3>
      <SummaryRow titulo="Libros" valor={fmt(sub)} />
      {cotizacion ? (
        <>
          <SummaryRow titulo="Envío" detalle={`${cotizacion.cantidadEnvios} ${plural(cotizacion.cantidadEnvios, 'envío', 'envíos')} (uno por vendedor)`} valor={fmt(cotizacion.costoEnvio)} />
          {(cotizacion.envios || []).length > 1 && (
            <ul className="env-det">
              {cotizacion.envios.map((e) => (
                <li key={e.idVendedor}>
                  <span>{e.vendedor} · {e.zona === 'misma' ? 'misma provincia' : 'otra provincia'}</span>
                  <span>{fmt(e.costo)}</span>
                </li>
              ))}
            </ul>
          )}
          <SummaryRow titulo="Total" valor={fmt(cotizacion.total)} total />
        </>
      ) : (
        <>
          <SummaryRow titulo="Envío" valor="Elegí una dirección" />
          <SummaryRow titulo="Total" valor={fmt(sub)} total />
        </>
      )}
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
