import { AVATARES, buscarAvatar } from '../data/avatares'

// `elegido` puede traer una clave vieja: se compara contra la clave vigente
const AvatarPicker = ({ elegido, onElegir }) => {
  const claveActual = buscarAvatar(elegido)?.clave
  return (
    <div className="avs" role="group" aria-label="Elegí un avatar">
      {AVATARES.map(({ clave, nombre, src }) => (
        <button
          key={clave}
          type="button"
          className={`avb${clave === claveActual ? ' on' : ''}`}
          aria-label={nombre}
          aria-pressed={clave === claveActual}
          title={nombre}
          onClick={() => onElegir(clave)}
        >
          <img src={src} alt="" width="64" height="64" loading="lazy" draggable="false" />
        </button>
      ))}
    </div>
  )
}

export default AvatarPicker
