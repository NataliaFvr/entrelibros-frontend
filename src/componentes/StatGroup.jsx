import StatBar from './StatBar'

// Barras por grupo. `items` = [{ cat, usado, q, r }], `clave` decide en qué grupo cae cada uno.
const StatGroup = ({ titulo, items, clave, total }) => {
  const grupos = {}
  items.forEach((i) => {
    const nombre = clave(i)
    grupos[nombre] = grupos[nombre] || { r: 0, q: 0 }
    grupos[nombre].r += i.r
    grupos[nombre].q += i.q
  })
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 className="fr">{titulo}</h3>
      {Object.entries(grupos).sort((a, b) => b[1].r - a[1].r).map(([nombre, g]) => (
        <StatBar key={nombre} nombre={nombre} ingresos={g.r} unidades={g.q} total={total} />
      ))}
    </div>
  )
}

export default StatGroup
