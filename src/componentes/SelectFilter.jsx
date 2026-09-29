// Filtro genérico de tipo desplegable. `opciones`: array de strings o de [valor, etiqueta].
const SelectFilter = ({ titulo, primera, opciones, value, onChange }) => {
  return (
    <div className="fbox">
      <h3>{titulo}</h3>
      <select className="fsel" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{primera}</option>
        {opciones.map((o) => {
          const [v, etiqueta] = Array.isArray(o) ? o : [o, o]
          return <option key={v} value={v}>{etiqueta}</option>
        })}
      </select>
    </div>
  )
}

export default SelectFilter
