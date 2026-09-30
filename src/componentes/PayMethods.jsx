import { METODOS } from '../data/metodosPago'

const PayMethods = ({ value, onChange }) => {
  return (
    <div className="pms">
      {METODOS.map(([clave, titulo, detalle]) => (
        <label key={clave} className={`pm${value === clave ? ' on' : ''}`}>
          <input type="radio" name="pm" value={clave} checked={value === clave} onChange={() => onChange('pm', clave)} />
          <span><b>{titulo}</b><small>{detalle}</small></span>
        </label>
      ))}
    </div>
  )
}

export default PayMethods
