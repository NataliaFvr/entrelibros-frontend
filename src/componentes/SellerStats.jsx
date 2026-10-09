import { fmt } from '../utils/format'
import EmptyBlock from './EmptyBlock'
import StatGroup from './StatGroup'

const Numero = ({ valor, texto }) => <div className="card"><b>{valor}</b><small>{texto}</small></div>

// Presentacional: muestra el modelo { ingresos, unidades, ventas, promedio, categorias, estados } que arma
// useEstadisticasVendedor obtiene los datos del back.
const SellerStats = ({ estadisticas, error = false }) => {
  if (error) return <EmptyBlock titulo="No pudimos cargar tus estadísticas" texto="Intentá de nuevo en un momento." />
  if (!estadisticas) return null
  if (!estadisticas.unidades) return <EmptyBlock titulo="Sin datos todavía" texto="Las estadísticas se arman a partir de tus ventas pagadas." />

  const { ingresos, unidades, promedio, categorias, estados } = estadisticas
  return (
    <>
      <div className="st-k">
        <Numero valor={fmt(ingresos)} texto="Ingresos por libros" />
        <Numero valor={unidades} texto="Unidades vendidas" />
        <Numero valor={fmt(Math.round(promedio))} texto="Promedio por venta" />
      </div>
      <StatGroup titulo="Ventas por categoría" grupos={categorias} total={ingresos} />
      <StatGroup titulo="Nuevos vs. usados" grupos={estados} total={ingresos} />
    </>
  )
}

export default SellerStats
