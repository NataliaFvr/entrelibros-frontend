import { coverBg, initials, textOn } from '../../utils/colors'

// Lista de sugerencias del buscador. `items` = [{tipo:'autor'|'libro'|'todos', ...}]
export default function SearchSuggestions({ items, texto, activo, onElegir }) {
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
        return (
          <div key={it.key} className={cls} role="option" onMouseDown={(e) => { e.preventDefault(); onElegir(it) }}>
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
        )
      })}
    </div>
  )
}
