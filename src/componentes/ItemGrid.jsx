import { Link } from 'react-router-dom'
import useColumnas from '../hooks/useColumnas'

// Una sola fila adaptable: muestra los primeros que entran en el ancho y, si sobran, un último "Ver más".
// `items` ya viene ordenado (los más importantes primero). `render(item, i)` dibuja cada uno.
const ItemGrid = ({ items, render, verMasTo }) => {
  const [ref, columnas] = useColumnas()
  const sobran = items.length > columnas
  const visibles = sobran ? items.slice(0, columnas - 1) : items

  return (
    <div className="item-grid" ref={ref}>
      {visibles.map(render)}
      {sobran && (
        <Link to={verMasTo} className="cat-item ver-mas">
          <div className="cat-circle" aria-hidden="true">→</div>
          <span>Ver más</span>
        </Link>
      )}
    </div>
  )
}

export default ItemGrid
