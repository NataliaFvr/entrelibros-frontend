import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useSugerencias from '../hooks/useSugerencias'
import { rutaVendedor } from '../utils/vendedor'
import SearchSuggestions from './SearchSuggestions'

const SearchBox = () => {
  const navigate = useNavigate()
  const { libros } = useLibros()
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(-1)
  const items = useSugerencias(libros, texto)
  const hayTexto = texto.trim() !== ''

  const cerrar = () => { setAbierto(false); setActivo(-1) }

  const buscar = (q) => {
    cerrar()
    const t = q.trim()
    navigate(t ? `/libros?q=${encodeURIComponent(t)}` : '/libros')
  }

  const elegir = (it) => {
    cerrar()
    if (it.tipo === 'autor') navigate(`/libros?autor=${encodeURIComponent(it.nombre)}`)
    else if (it.tipo === 'libro') navigate(`/libro/${it.libro.id}`)
    else if (it.tipo === 'vendedor') navigate(rutaVendedor(it.tienda))
    else buscar(texto)
  }

  const onKeyDown = (e) => {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && abierto && items.length) {
      e.preventDefault()
      const d = e.key === 'ArrowDown' ? 1 : -1
      setActivo((activo + d + items.length) % items.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activo >= 0 && items[activo]) elegir(items[activo])
      else buscar(texto)
    } else if (e.key === 'Escape') cerrar()
  }

  return (
    <div className="search">
      <input
        type="search" placeholder="Buscar libros, autores, tiendas..." autoComplete="off"
        aria-label="Buscar libros, autores o vendedores" value={texto}
        onChange={(e) => { setTexto(e.target.value); setAbierto(true); setActivo(-1) }}
        onFocus={() => setAbierto(true)} onBlur={cerrar} onKeyDown={onKeyDown}
      />
      {abierto && hayTexto && (
        <SearchSuggestions items={items} texto={texto.trim()} activo={activo} onElegir={elegir} onCerrar={cerrar} />
      )}
    </div>
  )
}

export default SearchBox
