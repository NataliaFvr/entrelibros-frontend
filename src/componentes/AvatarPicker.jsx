import { AVATARES } from '../data/avatares'
import AvatarSvg from './AvatarSvg'

const AvatarPicker = ({ elegido, onElegir }) => {
  return (
    <div className="avs">
      {AVATARES.map(([clave], i) => (
        <button key={clave} type="button" className={`avb${clave === elegido ? ' on' : ''}`} aria-label={`Avatar ${clave}`} onClick={() => onElegir(clave)}>
          <AvatarSvg indice={i} />
        </button>
      ))}
    </div>
  )
}

export default AvatarPicker
