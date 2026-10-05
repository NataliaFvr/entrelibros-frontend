import useFormulario from '../hooks/useFormulario'
import Field from './Field'

const MAX_NOMBRE = 40
const validadores = { nombre: (v) => (String(v ?? '').trim() ? '' : 'Escribí el nombre de la categoría.') }

// Formulario de alta. `onCrear(nombre)` devuelve { ok } o { error }; el error (por ejemplo "ya existe") se muestra bajo el campo.
const NuevaCategoriaForm = ({ onCrear }) => {
  const f = useFormulario({ nombre: '' }, validadores)

  const enviar = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (Object.keys(f.validarTodo(form)).length) return
    const r = await onCrear(f.valores.nombre)
    if (r.error) f.setErroresCampos({ nombre: r.error })
    else f.reiniciar()
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Nueva categoría</h3>
      <Field label="Nombre" name="nombre" value={f.valores.nombre} onChange={f.cambiar} onBlur={f.alSalir}
        error={f.errores.nombre} maxLength={MAX_NOMBRE} autoComplete="off" />
      <button className="btn main" type="submit">Crear categoría</button>
    </form>
  )
}

export default NuevaCategoriaForm
