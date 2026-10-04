const AddressCard = ({ direccion, usos = 0, onEliminar, onPrincipal }) => {
  const { alias, calle, ciudad, prov, cp, principal } = direccion

  return (
    <article className={`card adr${principal ? ' adr-main' : ''}`}>
      <header className="adr-h">
        <b className="fr">{alias}</b>
        {principal && <span className="tg adr-badge">Dirección principal</span>}
      </header>
      <div className="adr-body">
        <p>{calle}</p>
        <p>{ciudad}, {prov}</p>
        {cp && <small>CP {cp}</small>}
        {usos > 0 && <small>Usada en {usos} {usos === 1 ? 'compra' : 'compras'}</small>}
      </div>
      <footer className="adr-f">
        {!principal && <button className="lnk" type="button" onClick={onPrincipal}>Marcar como principal</button>}
        <button className="lnk" type="button" onClick={onEliminar}>Eliminar</button>
      </footer>
    </article>
  )
}

export default AddressCard
