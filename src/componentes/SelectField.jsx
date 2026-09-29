// Desplegable con etiqueta. `opciones`: array de strings.
const SelectField = ({ label, name, value, onChange, opciones }) => {
  return (
    <label className="fld">
      {label}
      <select className="fsel" name={name} value={value} onChange={(e) => onChange(name, e.target.value)}>
        {opciones.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

export default SelectField
