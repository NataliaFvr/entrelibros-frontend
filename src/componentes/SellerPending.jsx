// Solicitud en revisión. Sin panel de administración todavía, hay un botón de demo para aprobarla.
const SellerPending = ({ tienda, onAprobar }) => {
  return (
    <div className="card">
      <h3 className="fr">Tu solicitud está en revisión</h3>
      <p className="sell-note" style={{ margin: '10px 0 16px' }}>
        Enviaste la solicitud para <b>{tienda}</b>. Un administrador la va a verificar y te avisamos cuando la resuelva.
      </p>
      <button className="btn alt" type="button" onClick={onAprobar}>Simular aprobación del administrador (demo)</button>
    </div>
  )
}

export default SellerPending
