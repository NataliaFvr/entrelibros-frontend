import { direccionTexto } from '../utils/format'

const AddressSelect = ({ direcciones, elegida, onElegir }) => {
  return (
    <label className="fld">
      Enviar a
      <select className="fsel" value={elegida} onChange={(e) => onElegir(+e.target.value)}>
        {direcciones.map((d, i) => <option key={i} value={i}>{direccionTexto(d)}</option>)}
      </select>
    </label>
  )
}

export default AddressSelect
