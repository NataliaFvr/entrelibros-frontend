import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import RatingInput from './RatingInput'

const ReviewForm = ({ onPublicar, onCancelar }) => {
  const toast = useToast()
  const [puntos, setPuntos] = useState(0)
  const [texto, setTexto] = useState('')

  const enviar = () => {
    if (!puntos || texto.trim().length < 3) return toast('Elegí una puntuación y escribí tu opinión')
    onPublicar(puntos, texto.trim())
  }

  return (
    <div className="rvf">
      <RatingInput value={puntos} onChange={setPuntos} />
      <textarea rows={3} maxLength={500} placeholder="Contá qué te pareció el libro" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <div className="rvf-b">
        <button className="btn main" type="button" onClick={enviar}>Publicar opinión</button>
        <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default ReviewForm
