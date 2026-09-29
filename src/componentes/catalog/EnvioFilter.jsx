const OPCIONES = [['misma', 'Misma provincia'], ['distinta', 'Provincia distinta']]

export default function EnvioFilter({ value, onToggle }) {
  return (
    <div className="fbox">
      <h3>Envíos</h3>
      {OPCIONES.map(([v, etiqueta]) => (
        <label key={v} className="tgl">
          {etiqueta}
          <input type="checkbox" checked={value.includes(v)} onChange={() => onToggle(v)} />
          <span className="sw" />
        </label>
      ))}
    </div>
  )
}
