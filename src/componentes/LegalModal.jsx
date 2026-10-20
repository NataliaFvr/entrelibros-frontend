import { useEffect, useRef } from 'react'
import MiniDeco from './MiniDeco'

// Pop-up de un documento legal (Términos / Privacidad). `doc` = { label, secciones }.
// Se cierra con la cruz, "Entendido", Escape o tocando el fondo.
const LegalModal = ({ doc, onCerrar }) => {
  const cerrarRef = useRef(null)

  // El foco entra al pop-up para que Escape (onKeyDown) lo cierre. El scroll de atrás lo traba el CSS.
  useEffect(() => { cerrarRef.current?.focus() }, [])

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}
      onKeyDown={(e) => { if (e.key === 'Escape') onCerrar() }}>
      <div className="modal-card legal-card" role="dialog" aria-modal="true" aria-labelledby="legal-t">
        <button ref={cerrarRef} className="modal-x" type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        <MiniDeco />
        <h2 className="fr" id="legal-t">{doc.label}</h2>
        {doc.secciones.map(({ titulo, texto }) => (
          <section key={titulo}>
            <h3 className="fr">{titulo}</h3>
            <p className="lt">{texto}</p>
          </section>
        ))}
        <div className="modal-btns">
          <button className="btn main" type="button" onClick={onCerrar}>Entendido</button>
        </div>
      </div>
    </div>
  )
}

export default LegalModal
