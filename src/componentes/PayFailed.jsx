const MENSAJES = {
  CANCELADO: ['Cancelaste esta compra', 'Liberamos los libros para que otras personas puedan comprarlos.'],
  VENCIDO: ['La reserva venció', 'Pasó más de 1 hora sin completar el pago, así que liberamos los libros. Podés volver a intentarlo desde el catálogo.'],
  RECHAZADO: ['El pago fue rechazado', 'No se pudo procesar el pago de este pedido. Podés volver a intentarlo con otra compra.'],
}

const PayFailed = ({ pedido, estado, onCatalogo, onVerCompras }) => {
  const [titulo, texto] = MENSAJES[estado]
  return (
    <div className="card pay-res">
      <div className="pay-ic bad" aria-hidden="true">✕</div>
      <h2 className="fr">{titulo}</h2>
      <p>Pedido <b>{pedido.n}</b>. {texto}</p>
      <div className="rvf-b" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn main" type="button" onClick={onCatalogo}>Ver el catálogo</button>
        <button className="btn alt" type="button" onClick={onVerCompras}>Mis compras</button>
      </div>
    </div>
  )
}

export default PayFailed
