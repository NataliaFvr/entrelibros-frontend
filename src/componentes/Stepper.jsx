const PASOS = ['Carrito', 'Pago', 'Confirmación']

// `actual` = índice del paso en curso (3 = todo completado)
const Stepper = ({ actual }) => {
  return (
    <ol className="steps" aria-label="Pasos de la compra">
      {PASOS.map((titulo, i) => (
        <li key={titulo} className={i < actual ? 'done' : i === actual ? 'now' : ''}>
          <i>{i < actual ? '✓' : i + 1}</i>{titulo}
        </li>
      ))}
    </ol>
  )
}

export default Stepper
