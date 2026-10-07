import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { coverBg, initials, textOn } from '../utils/colors'
import { plural } from '../utils/format'
import { rutaVendedor } from '../utils/vendedor'
import './SearchResults.css'

// Lista de sugerencias del buscador. `items` = [{tipo:'autor'|'libro'|'vendedor'|'todos', ...}]
// Los vendedores van en su propia sección y son enlaces directos a /vendedor/:id.
const SearchSuggestions = ({ items, texto, activo, onElegir, onCerrar }) => {
  if (!items.length) {
    return (
      <div className="suggest" role="listbox">
        <div className="sg none">No encontramos coincidencias para “{texto}”</div>
      </div>
    )
  }

  return (
    <div className="suggest" role="listbox">
      {items.map((it, i) => {
        const cls = `sg${it.tipo === 'todos' ? ' all' : ''}${i === activo ? ' act' : ''}`
        const primerVendedor = it.tipo === 'vendedor' && items[i - 1]?.tipo !== 'vendedor'
        return (
          <Fragment key={it.key}>
            {primerVendedor && <div className="sg-h" role="presentation">Vendedores recomendados</div>}
            {it.tipo === 'vendedor' ? (
              // onMouseDown evita que el input pierda el foco (y cierre la lista) antes de que el enlace reciba el clic
              <Link to={rutaVendedor(it.tienda, it.id)} className={cls} role="option" aria-selected={i === activo}
                onMouseDown={(e) => e.preventDefault()} onClick={onCerrar}>
                <span className="sgi au">{initials(it.tienda, 2).toUpperCase()}</span>
                <span><b>{it.tienda}</b><small>Vendedor · {it.cantidad} {plural(it.cantidad, 'libro', 'libros')}</small></span>
              </Link>
            ) : (
              <div className={cls} role="option" aria-selected={i === activo} onMouseDown={(e) => { e.preventDefault(); onElegir(it) }}>
                {it.tipo === 'autor' && (
                  <>
                    <span className="sgi au">{initials(it.nombre)}</span>
                    <span><b>{it.nombre}</b><small>Autor</small></span>
                  </>
                )}
                {it.tipo === 'libro' && (
                  <>
                    <span className="sgi" style={{ background: coverBg(it.libro), color: textOn(it.libro.c) }} />
                    <span><b>{it.libro.t}</b><small>{it.libro.a}</small></span>
                  </>
                )}
                {it.tipo === 'todos' && <>Ver todos los resultados para “{texto}”</>}
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default SearchSuggestions
