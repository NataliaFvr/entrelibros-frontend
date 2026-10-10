const OPCIONES = [['misma', 'Misma provincia'], ['distinta', 'Provincia distinta']]

const EnvioFilter = ({ value, onToggle, disabled = false }) => {
  return (
    <div className="fbox">
      <h3>Envíos</h3>
      {OPCIONES.map(([v, etiqueta]) => (
        <label key={v} className="tgl">
          {etiqueta}
          <input type="checkbox" checked={value.includes(v)} onChange={() => onToggle(v)} disabled={disabled} />
          <span className="sw" />
        </label>
      ))}
      {disabled && <small className="dim">Agregá una dirección para filtrar por provincia.</small>}
    </div>
  )
}

export default EnvioFilter
