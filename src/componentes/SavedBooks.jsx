import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCompra } from '../hooks/useCompra'
import { useLibros } from '../hooks/useLibros'
import useLibroPropio from '../hooks/useLibroPropio'
import EmptyBlock from './EmptyBlock'
import SavedBook from './SavedBook'

// Pestaña Marcapáginas: los libros guardados, en el orden en que se guardaron
const SavedBooks = () => {
  const navigate = useNavigate()
  const { marks, toggleMark } = useAuth()
  const { agregar } = useCompra()
  const { libros } = useLibros()
  const { esPropio } = useLibroPropio()

  const guardados = marks.map((id) => libros.find((l) => l.id === id)).filter(Boolean)

  if (!guardados.length) {
    return (
      <EmptyBlock titulo="Tu Marcapáginas está vacío" texto="Guardá libros con el botón de cada ficha para encontrarlos acá."
        boton="Ver libros" onClick={() => navigate('/libros')} />
    )
  }

  return (
    <div className="grid">
      {guardados.map((l) => (
        <SavedBook key={l.id} libro={l} propio={esPropio(l)} onAlCarrito={() => agregar(l)} onQuitar={() => toggleMark(l.id)} />
      ))}
    </div>
  )
}

export default SavedBooks
