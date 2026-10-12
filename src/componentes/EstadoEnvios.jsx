// Estado de envío de un pedido pagado, una fila por vendedor (cada vendedor registra el suyo).
// `envios` = [{ idVendedor, nombre, enviado, cancelada }] (OrdenResponse.envios). Sin datos no dibuja nada.
const ESTADOS = {
  enviado: ['Enviado', 'used'],
  cancelada: ['Cancelado por el vendedor', 'off'],
  pendiente: ['Preparando el envío', ''],
}

const claveEstado = (e) => (e.cancelada ? 'cancelada' : e.enviado ? 'enviado' : 'pendiente')

const EstadoEnvios = ({ envios = [], libros = [] }) => {
  if (!envios.length) return null
  return (
    <ul className="ord-envios" aria-label="Estado del envío">
      {envios.map((e) => {
        const [texto, clase] = ESTADOS[claveEstado(e)]
        const vendedor = libros.find((l) => l.vId === e.idVendedor)?.v || e.nombre || 'vendedor'
        return (
          <li key={e.idVendedor}>
            <span>Envío de {vendedor}</span>
            <span className={`tg ${clase}`.trim()}>{texto}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default EstadoEnvios
