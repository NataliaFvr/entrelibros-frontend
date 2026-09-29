import { useState } from 'react'
import CoverArt from './CoverArt'

const VISTAS = ['Portada', 'Contraportada', 'Lomo']

const Gallery = ({ libro }) => {
  const [vista, setVista] = useState(0)
  const fotos = libro.imgs && libro.imgs.length ? libro.imgs.length : VISTAS.length
  const etiqueta = (i) => (libro.imgs && libro.imgs.length ? `Foto ${i + 1}` : VISTAS[i])

  return (
    <div className="gal">
      <div className="thumbs">
        {Array.from({ length: fotos }, (_, i) => (
          <button key={i} className={`thumb${i === vista ? ' on' : ''}`} type="button" aria-label={etiqueta(i)} onClick={() => setVista(i)}>
            <CoverArt libro={libro} k={i} />
          </button>
        ))}
      </div>
      <div className="gmain" style={{ cursor: 'pointer' }} title="Siguiente imagen" onClick={() => setVista((vista + 1) % fotos)}>
        <CoverArt libro={libro} k={vista} />
      </div>
    </div>
  )
}

export default Gallery
