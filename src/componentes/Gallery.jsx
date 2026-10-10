import { useEffect, useState } from 'react'
import CoverArt from './CoverArt'
import useCarrusel from '../hooks/useCarrusel'
import { getImagenesApi } from '../api/librosApi'
import './Gallery.css'

const VISTAS = ['Portada', 'Contraportada', 'Lomo']

// Galería de la ficha como carrusel: con fotos reales muestra las del vendedor; sin fotos, portada / contraportada / lomo.
const Gallery = ({ libro }) => {
  const [fotos, setFotos] = useState(libro.imgs || [])

  // El catálogo solo trae la portada; al abrir la ficha se pide la galería completa.
  useEffect(() => {
    let vigente = true
    getImagenesApi(libro.id).then((imagenes) => {
      if (vigente && imagenes.length) setFotos(imagenes)
    }).catch(() => {})
    return () => { vigente = false }
  }, [libro.id])

  const libroConFotos = { ...libro, imgs: fotos }
  const reales = Boolean(fotos.length)
  const total = reales ? fotos.length : VISTAS.length
  const { indice, ir, siguiente, anterior, gestos } = useCarrusel(total)
  const etiqueta = (i) => (reales ? `Foto ${i + 1}` : VISTAS[i])

  return (
    <div className="gal">
      <div className="thumbs">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} className={`thumb${i === indice ? ' on' : ''}`} type="button" aria-label={etiqueta(i)} aria-current={i === indice} onClick={() => ir(i)}>
            <CoverArt libro={libroConFotos} k={i} />
          </button>
        ))}
      </div>
      <div className="gmain" role="group" aria-roledescription="carrusel" aria-label={`Imágenes de ${libro.t}`} tabIndex={0} {...gestos}>
        <CoverArt libro={libroConFotos} k={indice} />
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
