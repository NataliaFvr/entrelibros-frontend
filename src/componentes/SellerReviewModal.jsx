import { useEffect, useState } from 'react'
import RatingInput from './RatingInput'

// Modal "Escribir una reseña al vendedor": calificación 1-5 + comentario
const SellerReviewModal = ({ tienda, libro, inicial, onPublicar, onCerrar }) => {
  const [puntos, setPuntos] = useState(inicial ? inicial.st : 0)
  const [texto, setTexto] = useState(inicial ? inicial.t : '')
  const [error, setError] = useState('')

  useEffect(() => {
    const alEscape = (e) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', alEscape)
    return () => window.removeEventListener('keydown', alEscape)
  }, [onCerrar])

  const enviar = (e) => {
    e.preventDefault()
    if (!puntos) return setError('Elegí una calificación de 1 a 5 estrellas.')
    if (texto.trim().length < 3) return setError('Contanos brevemente cómo fue tu experiencia.')
    onPublicar(puntos, texto.trim())
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal-card sp-modal" role="dialog" aria-modal="true" aria-labelledby="sp-rt">
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        <h2 className="fr" id="sp-rt">{inicial ? 'Editar tu reseña' : 'Escribir una reseña'}</h2>
        <p className="modal-msg">Vendedor: <b>{tienda}</b>{libro && <> · Tu compra: {libro}</>}</p>
        <form className="aform" noValidate onSubmit={enviar}>
          <RatingInput value={puntos} onChange={setPuntos} />
          <label className="fld">
            Tu comentario
            <textarea rows={4} maxLength={300} placeholder="Contá cómo fue tu experiencia con el vendedor" value={texto} onChange={(e) => setTexto(e.target.value)} />
          </label>
          <p className="ferr" role="alert">{error}</p>
          <div className="rvf-b">
            <button className="btn main" type="submit">Publicar reseña</button>
            <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerReviewModal
