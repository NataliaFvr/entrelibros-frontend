import { useState } from 'react'
import { FORMATOS_IMAGEN } from '../utils/imagen'
import ImageCropper from './ImageCropper'
import './CategoryImageField.css'

// Foto de categoría: recorte y vista previa antes de guardar; el backend valida el archivo.
// `valor`: base64 actual ('' = sin foto). `onChange(base64 | '')`.
const CategoryImageField = ({ valor, onChange }) => {
  const [archivo, setArchivo] = useState(null)

  const elegir = (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    setArchivo(f)
  }

  return (
    <div className="cif">
      <span className="cif-lead">Foto de la categoría (opcional)</span>
      <div className="cif-row">
        <span className="cif-prev" aria-hidden="true">{valor ? <img src={valor} alt="" /> : '+'}</span>
        <div className="cif-acc">
          <label className="more up">
            {valor ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" hidden onChange={elegir} />
          </label>
          {valor && valor.startsWith('data:') && <button className="more" type="button" onClick={() => setArchivo(valor)}>Recortar</button>}
          {valor && <button className="more" type="button" onClick={() => onChange('')}>Quitar</button>}
        </div>
      </div>
      <small className="cif-hint">Se muestra en círculo en el inicio. El backend valida el archivo.</small>
      {archivo && (
        <ImageCropper origen={archivo} {...FORMATOS_IMAGEN.categoria}
          onListo={(d) => { onChange(d); setArchivo(null) }} onCancelar={() => setArchivo(null)} />
      )}
    </div>
  )
}

export default CategoryImageField
