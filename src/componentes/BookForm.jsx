import { useLibros } from '../hooks/useLibros'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import SelectField from './SelectField'

const desdeLibro = (p) => ({
  t: p.t || '', a: p.a || '', ed: p.ed || '', cat: p.cat || '', idioma: p.idioma || 'Español', anio: String(p.anio || ''),
  estado: p.usado ? 'Usado' : 'Nuevo', base: String(p.base || ''), d: String(p.d || 0), stock: String(p.usado ? 1 : p.stock || 1),
})

// Publicar o editar (`libro`). Al guardar entra en revisión del administrador.
const BookForm = ({ libro = {}, onGuardar, onCancelar }) => {
  const { categorias } = useLibros()
  const { valores, cambiar, error, setError } = useFormulario({ ...desdeLibro(libro), cat: libro.cat || categorias[0] || '' })
  const usado = valores.estado === 'Usado'

  const alCambiar = (nombre, valor) => {
    cambiar(nombre, valor)
    if (nombre === 'estado' && valor === 'Usado') cambiar('stock', '1') // los usados tienen 1 unidad
  }

  const enviar = (e) => {
    e.preventDefault()
    const base = +valores.base
    const d = +valores.d
    const anio = +valores.anio
    const stock = usado ? 1 : Math.floor(+valores.stock)
    if (!valores.t.trim() || !valores.a.trim() || !valores.ed.trim()) return setError('Completá título, autor y editorial.')
    if (!(anio >= 1500 && anio <= 2026)) return setError('Ingresá un año de edición válido.')
    if (!(base > 0)) return setError('El precio debe ser mayor a 0.')
    if (!(d >= 0 && d <= 90)) return setError('El descuento debe estar entre 0 y 90.')
    if (!(stock >= 1)) return setError('El stock debe ser al menos 1.')
    onGuardar({
      t: valores.t.trim(), a: valores.a.trim(), ed: valores.ed.trim(), cat: valores.cat, idioma: valores.idioma,
      anio, usado, base, d, stock,
    })
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">{libro.id ? 'Editar libro' : 'Publicar libro'}</h3>
      <Field label="Título" name="t" value={valores.t} onChange={alCambiar} />
      <div className="two">
        <Field label="Autor" name="a" value={valores.a} onChange={alCambiar} />
        <Field label="Editorial" name="ed" value={valores.ed} onChange={alCambiar} />
      </div>
      <div className="two">
        <SelectField label="Categoría" name="cat" value={valores.cat} onChange={alCambiar} opciones={categorias} />
        <SelectField label="Idioma" name="idioma" value={valores.idioma} onChange={alCambiar} opciones={['Español', 'Inglés', 'Portugués']} />
      </div>
      <div className="two">
        <Field label="Año de edición" name="anio" type="number" value={valores.anio} onChange={alCambiar} />
        <SelectField label="Estado" name="estado" value={valores.estado} onChange={alCambiar} opciones={['Nuevo', 'Usado']} />
      </div>
      <div className="two">
        <Field label="Precio ($)" name="base" type="number" min="1" value={valores.base} onChange={alCambiar} />
        <Field label="Descuento (%)" name="d" type="number" min="0" max="90" value={valores.d} onChange={alCambiar} />
      </div>
      <Field label="Stock (los usados: 1 unidad)" name="stock" type="number" min="1" value={valores.stock} onChange={alCambiar} readOnly={usado} />
      <p className="ferr" role="alert">{error}</p>
      <div className="rvf-b">
        <button className="btn main" type="submit">{libro.id ? 'Guardar cambios' : 'Publicar'}</button>
        {libro.id && <button className="btn alt" type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}

export default BookForm
