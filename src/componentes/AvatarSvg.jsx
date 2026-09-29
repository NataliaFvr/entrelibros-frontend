import { AVATARES } from '../data/avatares'
import { TONES, textOn } from '../utils/colors'

// Avatar de ícono: círculo de color con el dibujo del índice `indice` de AVATARES
const AvatarSvg = ({ indice }) => {
  const fondo = TONES[indice % TONES.length]
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <circle cx="24" cy="24" r="24" fill={fondo} />
      <g transform="translate(12 12)" fill="none" stroke={textOn(fondo)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={AVATARES[indice][1]} />
      </g>
    </svg>
  )
}

export default AvatarSvg
