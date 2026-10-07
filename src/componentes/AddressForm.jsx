import { PROVINCIAS } from '../data/provincias'
import { useAuth } from '../hooks/useAuth'
import { USAR_API } from '../utils/modoApi'
import useFormulario from '../hooks/useFormulario'
import { validadoresDireccion } from '../utils/validaciones'
import Field from './Field'
import SelectField from './SelectField'

const INICIAL = { alias: '', calle: '', ciudad: '', cp: '', prov: PROVINCIAS[0] }

// Formulario a todo el ancho: los campos se acomodan en una grilla que se adapta al contenedor
const AddressForm = () => {
  const { agregarDireccion } = useAuth()
  const f = useFormulario(INICIAL, validadoresDireccion)
  const campo = (n) => ({ name: n, value: f.valores[n], onChange: f.cambiar, onBlur: f.alSalir, error: f.errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    if (Object.keys(f.validarTodo(e.currentTarget)).length) return
    const { alias, calle, ciudad, prov, cp } = f.valores
    // Solo se limpia el formulario si se guardó: si el back falla, la persona conserva lo que escribió
    const guardada = await agregarDireccion({ alias: alias.trim(), calle: calle.trim(), ciudad: ciudad.trim(), prov, cp: cp.trim().toUpperCase() })
    if (guardada) f.reiniciar()
  }

  return (
    <form className="card aform addr-form" noValidate onSubmit={enviar}>
      <h3 className="fr">Nueva dirección</h3>
      <Field label="Nombre (Casa, Trabajo…)" maxLength={30} {...campo('alias')} />
      <Field label="Calle, número, piso y depto" maxLength={100} autoComplete="street-address" {...campo('calle')} />
      <Field label="Ciudad / localidad" maxLength={60} autoComplete="address-level2" {...campo('ciudad')} />
      <Field label={USAR_API ? 'Código postal' : 'Código postal (opcional)'} maxLength={8} autoComplete="postal-code" {...campo('cp')} />
      <SelectField label="Provincia" opciones={PROVINCIAS} {...campo('prov')} />
      <button className="btn main" type="submit">Guardar dirección</button>
    </form>
  )
}

export default AddressForm
