import { useEffect, useRef, useState } from 'react'
import RatingInput from './RatingInput'

// Modal "Escribir una reseña al vendedor": calificación 1-5 + comentario
const SellerReviewModal = ({ tienda, libro, inicial, onPublicar, onCerrar }) => {
  const [puntos, setPuntos] = useState(inicial ? inicial.st : 0)
  const [texto, setTexto] = useState(inicial ? inicial.t : '')

  const tarjetaRef = useRef(null)
  // El foco entra al pop-up para que Escape (onKeyDown) lo cierre
  useEffect(() => { tarjetaRef.current?.focus() }, [])

  const enviar = (e) => {
    e.preventDefault()
    onPublicar(puntos, texto.trim())
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}
      onKeyDown={(e) => { if (e.key === 'Escape') onCerrar() }}>
      <div className="modal-card sp-modal" role="dialog" aria-modal="true" aria-labelledby="sp-rt" tabIndex={-1} ref={tarjetaRef}>
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        <h2 className="fr" id="sp-rt">{inicial ? 'Editar tu reseña' : 'Escribir una reseña'}</h2>
        <p className="modal-msg">Vendedor: <b>{tienda}</b>{libro && <> · Tu compra: {libro}</>}</p>
        <form className="aform" noValidate onSubmit={enviar}>
          <RatingInput value={puntos} onChange={setPuntos} />
          <label className="fld">
            Tu comentario
            <textarea rows={4} placeholder="Contá cómo fue tu experiencia con el vendedor" value={texto} onChange={(e) => setTexto(e.target.value)} />
          </label>
          <div className="rvf-b">
            <button className="btn main" type="submit">{inicial ? 'Guardar cambios' : 'Publicar reseña'}</button>
            <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerReviewModal
