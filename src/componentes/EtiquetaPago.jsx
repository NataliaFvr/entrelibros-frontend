import { ETIQUETAS_PAGO } from '../utils/pedidos'

// Etiqueta de color con el estado de pago de una orden
const EtiquetaPago = ({ estado }) => {
  const [texto, clase] = ETIQUETAS_PAGO[estado]
  return <span className={`tg ${clase}`.trim()}>{texto}</span>
}

export default EtiquetaPago
