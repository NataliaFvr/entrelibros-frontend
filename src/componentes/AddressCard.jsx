import { TrashIcon } from './Icons'

// Ojo: el footer/header de la tarjeta son <div>, no <footer>/<header>: el CSS global pinta esas etiquetas
// (footer = fondo verde oscuro del sitio, header = barra sticky), y eso generaba el bloque oscuro.
const AddressCard = ({ direccion, usos = 0, onEliminar, onPrincipal }) => {
  const { alias, calle, ciudad, prov, cp, principal } = direccion

  return (
    <article className={`card adr${principal ? ' adr-main' : ''}`}>
      <div className="adr-h">
        <b className="fr">{alias}</b>
        {principal && <span className="tg adr-badge">Dirección principal</span>}
      </div>
      <div className="adr-body">
        <p>{calle}</p>
        <p>{ciudad}, {prov}</p>
        {cp && <small>CP {cp}</small>}
        {usos > 0 && <small>Usada en {usos} {usos === 1 ? 'compra' : 'compras'}</small>}
      </div>
      <div className="adr-f">
        {!principal && <button className="lnk" type="button" onClick={onPrincipal}>Marcar como principal</button>}
        <button className="adr-del" type="button" onClick={onEliminar} aria-label={`Eliminar dirección ${alias}`} title="Eliminar dirección">
          <TrashIcon /><span>Eliminar</span>
        </button>
      </div>
    </article>
  )
}

export default AddressCard
