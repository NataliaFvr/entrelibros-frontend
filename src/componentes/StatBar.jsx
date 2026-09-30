import { fmt } from '../utils/format'

const StatBar = ({ nombre, ingresos, unidades, total }) => {
  return (
    <div className="st-row">
      <span>{nombre}</span>
      <div className="bar"><i style={{ width: `${(ingresos / total) * 100}%` }} /></div>
      <small>{fmt(ingresos)} · {unidades} {unidades === 1 ? 'unidad' : 'unidades'} · {Math.round((ingresos / total) * 100)}%</small>
    </div>
  )
}

export default StatBar
