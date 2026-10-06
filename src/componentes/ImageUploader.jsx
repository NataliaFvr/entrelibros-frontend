import { useState } from 'react'
import ImageCropper from './ImageCropper'
import { MAX_FOTOS, MIN_FOTOS } from '../utils/imagen'
import './ImageUploader.css'

// Subida de 1 a 5 fotos del ejemplar con vista previa antes de publicar.
// La primera es la portada; las demás aparecen como carrusel en la ficha del libro.
// El estado vive en `useImagenesLibro` (lo recibe por props: `imagenes`).
const ImageUploader = ({ imagenes }) => {
  const { fotos, errores, recorte, elegir, confirmarRecorte, cancelarRecorte, recortar, puedeRecortar, quitar, mover } = imagenes
  const [activa, setActiva] = useState(0)
  const actual = Math.min(activa, Math.max(fotos.length - 1, 0))

  const alElegir = (e) => {
    if (e.target.files.length) elegir(e.target.files)
    e.target.value = ''
  }
  const alQuitar = () => { quitar(actual); setActiva(Math.max(actual - 1, 0)) }
  const alMover = (paso) => { mover(actual, paso); setActiva(actual + paso) }
  const entrada = <input type="file" accept="image/jpeg,image/png" multiple onChange={alElegir} disabled={fotos.length >= MAX_FOTOS} />

  return (
    <div className="iu">
      <span className="iu-lead">
        Fotos del libro ({MIN_FOTOS} a {MAX_FOTOS})
        <small className="iu-hint">JPG o PNG, hasta 10 MB cada una. En los usados, mostrá el estado real: tapa, lomo y páginas.</small>
      </span>

      <div className="iu-stage">
        {fotos.length ? (
          <div className="iu-big"><img src={fotos[actual]} alt={`Vista previa de la foto ${actual + 1}`} /></div>
        ) : (
          <label className="iu-empty"><b aria-hidden="true">+</b>Elegí una o más fotos{entrada}</label>
        )}

        <div className="iu-side" style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div className="iu-grid">
            {fotos.map((src, i) => (
              <button key={src.slice(-24) + i} type="button" className={`iu-th${i === actual ? ' on' : ''}`} aria-label={`Ver foto ${i + 1}`} onClick={() => setActiva(i)}>
                <img src={src} alt="" />
                {i === 0 && <span className="iu-cv">Portada</span>}
              </button>
            ))}
            {fotos.length > 0 && fotos.length < MAX_FOTOS && <label className="iu-add" title="Agregar fotos" aria-label="Agregar fotos">+{entrada}</label>}
          </div>

          {fotos.length > 0 && (
            <div className="iu-tools">
              <button className="lnk" type="button" onClick={() => alMover(-1)} disabled={actual === 0}>← Mover antes</button>
              <button className="lnk" type="button" onClick={() => alMover(1)} disabled={actual === fotos.length - 1}>Mover después →</button>
              {puedeRecortar(actual) && <button className="lnk" type="button" onClick={() => recortar(actual)}>Recortar esta foto</button>}
              <button className="lnk" type="button" onClick={alQuitar}>Quitar esta foto</button>
            </div>
          )}
          <span className="iu-count" role="status">
            {`${fotos.length} de ${MAX_FOTOS} fotos`}
          </span>
        </div>
      </div>

      <p className="iu-err" role="alert">{errores.join(' ')}</p>
      {recorte && (
        <ImageCropper key={recorte.restantes + String(recorte.origen).slice(-20)} origen={recorte.origen} aspecto={recorte.aspecto} anchoMax={recorte.anchoMax}
          titulo={recorte.restantes ? `${recorte.titulo} (faltan ${recorte.restantes} más)` : recorte.titulo}
          onListo={confirmarRecorte} onCancelar={cancelarRecorte} />
      )}
    </div>
  )
}

export default ImageUploader
