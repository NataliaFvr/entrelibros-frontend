import { fmt } from '../utils/format'
import EmptyBlock from './EmptyBlock'
import StatGroup from './StatGroup'

const Numero = ({ valor, texto }) => <div className="card"><b>{valor}</b><small>{texto}</small></div>

// Estadísticas armadas a partir del historial de ventas
const SellerStats = ({ ventas }) => {
  const items = ventas.flatMap((v) => v.its.map((i) => ({ cat: i.cat || 'Otros', usado: !!i.usado, q: i.q, r: i.p * i.q })))
  if (!items.length) return <EmptyBlock titulo="Sin datos todavía" texto="Las estadísticas se arman a partir de tu historial de ventas." />

  const total = items.reduce((a, i) => a + i.r, 0)
  const unidades = items.reduce((a, i) => a + i.q, 0)
  return (
    <>
      <div className="st-k">
        <Numero valor={fmt(total)} texto="Ingresos por libros" />
        <Numero valor={unidades} texto="Unidades vendidas" />
        <Numero valor={fmt(Math.round(total / ventas.length))} texto="Promedio por venta" />
      </div>
      <StatGroup titulo="Ventas por categoría" items={items} clave={(i) => i.cat} total={total} />
      <StatGroup titulo="Nuevos vs. usados" items={items} clave={(i) => (i.usado ? 'Usados' : 'Nuevos')} total={total} />
    </>
  )
}

export default SellerStats
