import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import { masVendidos } from '../utils/filtrarLibros'
import BookCarousel from '../componentes/BookCarousel'
import MiniDeco from '../componentes/MiniDeco'
import NotFoundArt from '../componentes/NotFoundArt'

// Ruta comodín (path="*"): cualquier URL que no exista cae acá
const NotFoundPage = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { libros } = useLibros()
  const [q, setQ] = useState('')

  const buscar = (e) => {
    e.preventDefault()
    const t = q.trim()
    navigate(t ? `/libros?q=${encodeURIComponent(t)}` : '/libros')
  }

  return (
    <main className="usr">
      <section className="nf">
        <NotFoundArt />
        <span className="nf-eyebrow">Capítulo 404</span>
        <h1 className="fr nf-t">Página o capítulo no encontrado</h1>
        <p className="nf-p">
          No encontramos <code>{pathname}</code>. Puede que el link esté mal escrito, que el libro ya se haya vendido o que esta página se haya perdido entre los estantes.
        </p>
        <Link to="/" className="nf-home">Volver al inicio</Link>
        <form className="nf-s" role="search" onSubmit={buscar}>
          <input type="search" placeholder="Buscar libros, autores..." aria-label="Buscar libros o autores" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn main" type="submit">Buscar</button>
        </form>
      </section>
      <section className="dsec">
        <h2 className="fr">Mientras tanto, quizás te guste</h2>
        <BookCarousel libros={masVendidos(libros)} />
      </section>
      <MiniDeco />
    </main>
  )
}

export default NotFoundPage
