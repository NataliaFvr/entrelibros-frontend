import CoverArt from './CoverArt'
import useCarrusel from '../hooks/useCarrusel'
import './Gallery.css'

const VISTAS = ['Portada', 'Contraportada', 'Lomo']

// Galería de la ficha como carrusel: con fotos reales muestra las del vendedor; sin fotos, portada / contraportada / lomo.
const Gallery = ({ libro }) => {
  const reales = Boolean(libro.imgs && libro.imgs.length)
  const total = reales ? libro.imgs.length : VISTAS.length
  const { indice, ir, siguiente, anterior, gestos } = useCarrusel(total)
  const etiqueta = (i) => (reales ? `Foto ${i + 1}` : VISTAS[i])

  return (
    <div className="gal">
      <div className="thumbs">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} className={`thumb${i === indice ? ' on' : ''}`} type="button" aria-label={etiqueta(i)} aria-current={i === indice} onClick={() => ir(i)}>
            <CoverArt libro={libro} k={i} />
          </button>
        ))}
      </div>
      <div className="gmain" role="group" aria-roledescription="carrusel" aria-label={`Imágenes de ${libro.t}`} tabIndex={0} {...gestos}>
        <CoverArt libro={libro} k={indice} />
        {total > 1 && (
          <>
            <button className="gnav prev" type="button" aria-label="Imagen anterior" onClick={anterior}>‹</button>
            <button className="gnav next" type="button" aria-label="Imagen siguiente" onClick={siguiente}>›</button>
            <span className="gcount" aria-live="polite">{indice + 1} / {total}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default Gallery
