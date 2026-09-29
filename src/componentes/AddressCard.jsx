const AddressCard = ({ direccion, onEliminar }) => {
  return (
    <div className="card adr">
      <div>
        <b className="fr">{direccion.alias}</b>
        <p>{direccion.calle}, {direccion.ciudad}</p>
        <small>{direccion.prov}{direccion.cp ? ` · CP ${direccion.cp}` : ''}</small>
      </div>
      <button className="lnk" type="button" onClick={onEliminar}>Eliminar</button>
    </div>
  )
}

export default AddressCard
