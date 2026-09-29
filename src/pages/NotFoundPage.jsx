import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import { masVendidos } from '../utils/filtrarLibros'
import BookCarousel from '../componentes/BookCarousel'
import MiniDeco from '../componentes/MiniDeco'

const NotFoundPage = ({ ruta }) => {
  const navigate = useNavigate()
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
        <svg className="nf-art" viewBox="0 0 520 220" aria-hidden="true">
          <text className="nf-n" x="260" y="190">404</text>
        </svg>
        <h1 className="fr nf-t">Esta página se perdió entre los estantes</h1>
        <p className="nf-p">
          Error 404. {ruta && <>No encontramos <code>{ruta}</code>. </>}
          Puede que el link esté mal escrito, que el libro ya se haya vendido o que la página ya no exista.
        </p>
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
