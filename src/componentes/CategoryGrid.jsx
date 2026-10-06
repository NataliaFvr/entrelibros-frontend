import { Link } from 'react-router-dom'
import { TONES, textOn } from '../utils/colors'
import { useLibros } from '../hooks/useLibros'
import ItemGrid from './ItemGrid'

// `categorias`: nombres, ordenadas de más a menos libros
const CategoryGrid = ({ categorias }) => {
  const { imagenesCategorias } = useLibros()
  return (
    <div className="cat-wrap">
      <h2>Categorías</h2>
      <ItemGrid items={categorias} verMasTo="/libros"
        render={(c, i) => {
          const col = TONES[i % TONES.length]
          return (
            <Link key={c} to={`/libros?cat=${encodeURIComponent(c)}`} className="cat-item">
              <div className="cat-circle" style={{ background: col, color: textOn(col) }}>
                {imagenesCategorias[c] ? <img className="cat-img" src={imagenesCategorias[c]} alt="" loading="lazy" /> : c[0]}
              </div>
              <span>{c}</span>
            </Link>
          )
        }} />
    </div>
  )
}

export default CategoryGrid
