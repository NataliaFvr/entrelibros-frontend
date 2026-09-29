// Mail de confirmación simulado (en producción lo envía el back)
const MailSim = ({ usuario, onConfirmarDesdeMail }) => {
  return (
    <div className="au-side">
      <div className="mailsim">
        <small>MAIL SIMULADO · SOLO DEMO</small>
        <div className="mail-h">
          <b>De:</b> Entrelibros {'<no-reply@entrelibros.com>'}<br />
          <b>Para:</b> {usuario.email}<br />
          <b>Asunto:</b> Confirmá tu cuenta de Entrelibros
        </div>
        <div className="mail-b">
          <p>¡Hola, {usuario.nombre}! Tu código de confirmación es</p>
          <div className="code">{usuario.codigo || '------'}</div>
          <p>Vence en 15 minutos.</p>
          <button className="btn alt" type="button" onClick={onConfirmarDesdeMail}>Confirmar cuenta desde el mail</button>
        </div>
      </div>
      <p>En producción este mail lo envía el back; lo mostramos acá para poder probar el flujo.</p>
    </div>
  )
}

export default MailSim
