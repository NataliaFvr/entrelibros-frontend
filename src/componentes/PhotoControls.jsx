import { useToast } from '../hooks/useToast'
import { recortarFoto } from '../utils/imagen'

const PhotoControls = ({ onFoto, onQuitar }) => {
  const toast = useToast()

  const elegir = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    recortarFoto(archivo).then(onFoto).catch(() => toast('No pudimos leer esa imagen'))
    e.target.value = ''
  }

  return (
    <div>
      <label className="more up">
        Subir foto
        <input type="file" accept="image/*" hidden onChange={elegir} />
      </label>{' '}
      <button className="more" type="button" onClick={onQuitar}>Quitar foto</button>
      <small>Si no tenés foto, elegí un avatar.</small>
    </div>
  )
}

export default PhotoControls
