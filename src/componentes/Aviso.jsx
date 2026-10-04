import { TITULOS, severidad } from '../utils/errorApi'

// Aviso visual de un error general del formulario (el que no pertenece a un solo campo).
// `tipo` es el tipo de errorApi: CREDENCIALES, CODIGO_INVALIDO, CUENTA_NO_CONFIRMADA, RED…
// No dibuja nada si no hay mensaje.
const Aviso = ({ mensaje, tipo = 'VALIDACION' }) => {
  if (!mensaje) return null
  const nivel = severidad(tipo)
  return (
    <div className={`aviso aviso-${nivel}`} role={nivel === 'error' ? 'alert' : 'status'}>
      <b>{TITULOS[tipo] || TITULOS.DESCONOCIDO}</b>
      <span>{mensaje}</span>
    </div>
  )
}

export default Aviso
