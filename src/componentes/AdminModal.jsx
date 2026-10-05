import { useEffect, useRef } from 'react'

// Pop-up del panel de administración. Se cierra con Escape, la cruz o el fondo; bloquea el scroll de la página detrás.
const AdminModal = ({ titulo, onCerrar, children }) => {
  const tarjetaRef = useRef(null)
  const cerrarRef = useRef(onCerrar)

  useEffect(() => { cerrarRef.current = onCerrar })

  useEffect(() => {
    const alEscape = (e) => { if (e.key === 'Escape') cerrarRef.current() }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alEscape)
    tarjetaRef.current?.focus()
    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', alEscape)
    }
  }, [])

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal-card adm-modal" role="dialog" aria-modal="true" aria-labelledby="adm-modal-t" tabIndex={-1} ref={tarjetaRef}>
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        <h2 className="fr" id="adm-modal-t">{titulo}</h2>
        {children}
      </div>
    </div>
  )
}

export default AdminModal
