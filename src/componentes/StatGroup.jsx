import StatBar from './StatBar'

// Barras por grupo. `grupos` = [{ nombre, unidades, ingresos }]
const StatGroup = ({ titulo, grupos, total }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <h3 className="fr">{titulo}</h3>
    {[...grupos].sort((a, b) => b.ingresos - a.ingresos).map((g) => (
      <StatBar key={g.nombre} nombre={g.nombre} ingresos={g.ingresos} unidades={g.unidades} total={total} />
    ))}
  </div>
)

export default StatGroup
