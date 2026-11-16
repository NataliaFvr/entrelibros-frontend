import { useSelector } from 'react-redux'
import { selectCatalogo } from '../redux/selectores'
import { Link } from 'react-router-dom'
import { TONES, textOn } from '../utils/colors'
import { useLibros } from '../hooks/useLibros'
import ItemGrid from './ItemGrid'
import CategoriaCirculo from './CategoriaCirculo'

// `categorias`: nombres, ordenadas de más a menos libros
const CategoryGrid = ({ categorias }) => {
  const catalogo = useSelector(selectCatalogo)
  const { imagenesCategorias } = useLibros(catalogo)
  return (
    <div className="cat-wrap">
      <h2>Categorías</h2>
      <ItemGrid items={categorias} verMasTo="/libros"
        render={(c, i) => {
          const col = TONES[i % TONES.length]
          return (
            <Link key={c} to={`/libros?cat=${encodeURIComponent(c)}`} className="cat-item">
              <div className="cat-circle" style={{ background: col, color: textOn(col) }}>
                <CategoriaCirculo nombre={c} src={imagenesCategorias[c]} />
              </div>
              <span>{c}</span>
            </Link>
          )
        }} />
    </div>
  )
}

export default CategoryGrid