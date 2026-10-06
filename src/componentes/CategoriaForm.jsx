import useFormulario from '../hooks/useFormulario'
import { CATEGORIA_MAX, validarNombreCategoria } from '../utils/validaciones'
import Aviso from './Aviso'
import CategoryImageField from './CategoryImageField'
import Field from './Field'

const validadores = { nombre: validarNombreCategoria }

// Alta o edición de una categoría (nombre + foto opcional). `onGuardar({ nombre, imagen })` devuelve { ok } o { error }.
// Con `inicial` edita; sin `inicial` crea y se vacía al terminar. `onListo` (opcional) se llama al guardar bien (para cerrar el pop-up).
const CategoriaForm = ({ inicial, onGuardar, onListo, onCancelar }) => {
  const editando = Boolean(inicial)
  const f = useFormulario({ nombre: inicial?.nombre ?? '', imagen: inicial?.imagen ?? '' }, validadores, { enVivo: ['nombre'] })

  const enviar = async (e) => {
    e.preventDefault()
    if (Object.keys(f.validarTodo(e.currentTarget)).length) return
    const r = await onGuardar({ nombre: f.valores.nombre, imagen: f.valores.imagen })
    if (r.error) return f.setError(r.error, 'DUPLICADO')
    if (!editando) f.reiniciar()
    if (onListo) onListo()
  }

  return (
    <form className="aform" noValidate onSubmit={enviar}>
      <Field label="Nombre" name="nombre" value={f.valores.nombre} onChange={f.cambiar} onBlur={f.alSalir}
        error={f.errores.nombre} maxLength={CATEGORIA_MAX} autoComplete="off" />
      <CategoryImageField valor={f.valores.imagen} onChange={(d) => f.cambiar('imagen', d)} />
      <Aviso mensaje={f.error} tipo={f.tipoError} />
      <div className="modal-btns">
        <button className="btn main" type="submit">{editando ? 'Guardar cambios' : 'Crear categoría'}</button>
        {onCancelar && <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}

export default CategoriaForm
