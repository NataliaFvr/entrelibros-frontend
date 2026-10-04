import { PROVINCIAS } from '../data/provincias'
import { useAuth } from '../hooks/useAuth'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import SelectField from './SelectField'

const INICIAL = { alias: '', calle: '', ciudad: '', cp: '', prov: PROVINCIAS[0] }

// Formulario a todo el ancho: los campos se acomodan en una grilla que se adapta al contenedor
const AddressForm = () => {
  const { agregarDireccion } = useAuth()
  const { valores, cambiar, error, setError, reiniciar } = useFormulario(INICIAL)

  const enviar = (e) => {
    e.preventDefault()
    if (!valores.alias.trim() || !valores.calle.trim() || !valores.ciudad.trim()) return setError('Completá nombre, calle y ciudad.')
    agregarDireccion({
      alias: valores.alias.trim(), calle: valores.calle.trim(), ciudad: valores.ciudad.trim(),
      prov: valores.prov, cp: valores.cp.trim(),
    })
    reiniciar()
  }

  return (
    <form className="card aform addr-form" noValidate onSubmit={enviar}>
      <h3 className="fr">Nueva dirección</h3>
      <Field label="Nombre (Casa, Trabajo…)" name="alias" value={valores.alias} onChange={cambiar} />
      <Field label="Calle, número, piso y depto" name="calle" value={valores.calle} onChange={cambiar} autoComplete="street-address" />
      <Field label="Ciudad / localidad" name="ciudad" value={valores.ciudad} onChange={cambiar} />
      <Field label="Código postal" name="cp" value={valores.cp} onChange={cambiar} autoComplete="postal-code" />
      <SelectField label="Provincia" name="prov" value={valores.prov} onChange={cambiar} opciones={PROVINCIAS} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Guardar dirección</button>
    </form>
  )
}

export default AddressForm
