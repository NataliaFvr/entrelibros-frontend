import { validarTarjeta } from '../utils/tarjeta'
import PayMethods from './PayMethods'
import CardFields from './CardFields'

// El botón "Pagar" está en el resumen y usa form="fPay" para enviar este formulario.
// `form` (valores, cambiar, completar) vive en la página, así no se pierde mientras se procesa el pago.
const PayForm = ({ form, usuario, nota, error, onError, onPagar }) => {
  const { valores, cambiar, completar } = form

  const enviar = (e) => {
    e.preventDefault()
    const mensaje = valores.pm === 'tarjeta' ? validarTarjeta(valores) : ''
    onError(mensaje)
    if (!mensaje) onPagar(valores.pm)
  }

  const tarjetaDePrueba = () => {
    completar({ numero: '4242 4242 4242 4242', titular: `${usuario.nombre} ${usuario.apellido}`, venc: '12/39', cvv: '123' })
    onError('')
  }

  return (
    <div className="card">
      <h3 className="fr" style={{ marginBottom: 14 }}>Método de pago</h3>
      <form id="fPay" className="aform" noValidate onSubmit={enviar}>
        {nota && <div className="note bad" role="alert">{nota}</div>}
        <PayMethods value={valores.pm} onChange={cambiar} />
        {valores.pm === 'tarjeta' && <CardFields valores={valores} onChange={cambiar} onCompletar={tarjetaDePrueba} />}
        {valores.pm === 'mercadopago' && (
          <div className="note">Al confirmar te llevamos a Mercado Pago para completar el pago. <b>Simulado:</b> no salís de Entrelibros.</div>
        )}
        {valores.pm === 'transferencia' && (
          <div className="note">Te mostramos el CBU y el alias para transferir y la acreditación es inmediata. <b>Simulado.</b></div>
        )}
        <p className="ferr" role="alert">{error}</p>
      </form>
    </div>
  )
}

export default PayForm
