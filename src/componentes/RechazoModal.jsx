import { useEffect, useRef, useState } from 'react'
import Aviso from './Aviso'

const MIN_MOTIVO = 3 // mismo mínimo que valida el servicio

// Pop-up para rechazar: el motivo es obligatorio y el vendedor lo ve. Se cierra con Escape, la cruz, "Cancelar" o el fondo.
// `onConfirmar(motivo)` devuelve { ok } o { error }: si hay error el pop-up sigue abierto y lo muestra.
const RechazoModal = ({ titulo, onConfirmar, onCerrar }) => {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const campoRef = useRef(null)

  useEffect(() => {
    campoRef.current?.focus()
    const alEscape = (e) => { if (e.key === 'Escape') onCerrar() }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alEscape)
    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', alEscape)
    }
  }, [onCerrar])

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    if (motivo.trim().length < MIN_MOTIVO) {
      setError('Explicale al vendedor por qué rechazás el libro.')
      return campoRef.current?.focus()
    }
    setError('')
    setEnviando(true)
    const respuesta = await onConfirmar(motivo.trim())
    setEnviando(false)
    if (respuesta && respuesta.error) setError(respuesta.error)
    else onCerrar()
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <form className="modal-card mod-modal" role="dialog" aria-modal="true" aria-labelledby="rechazo-t" noValidate onSubmit={enviar}>
        <button className="modal-x" type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        <h2 className="fr" id="rechazo-t">Rechazar libro</h2>
        <p className="modal-msg">“{titulo}” volverá al vendedor con tu motivo.</p>
        <label className="fld mod-motivo">
          Motivo del rechazo (obligatorio)
          <textarea ref={campoRef} value={motivo} maxLength={500} rows={4} required aria-invalid={Boolean(error)}
            onChange={(e) => setMotivo(e.target.value)} placeholder="Ej.: las fotos no se ven bien o el precio no corresponde." />
        </label>
        <small className="iu-hint">{motivo.length} / 500</small>
        <Aviso mensaje={error} tipo="VALIDACION" />
        <div className="modal-btns mod-modal-btns">
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
          <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Rechazar libro'}</button>
        </div>
      </form>
    </div>
  )
}

export default RechazoModal
