import { METODOS } from '../data/metodosPago'

const PayMethods = ({ value, onChange }) => {
  return (
    <div className="pms">
      {METODOS.map(([clave, titulo, detalle]) => (
        <label key={clave} className={`pm${value === clave ? ' on' : ''}`}>
          <input type="radio" name="proveedor" value={clave} checked={value === clave} onChange={() => onChange('proveedor', clave)} />
          <span><b>{titulo}</b><small>{detalle}</small></span>
        </label>
      ))}
    </div>
  )
}

export default PayMethods
