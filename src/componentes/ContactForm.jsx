import useFormulario from '../hooks/useFormulario'
import { useToast } from '../hooks/useToast'
import { validarContacto } from '../utils/validaciones'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

const INICIAL = { nombre: '', apellido: '', email: '', area: '', tel: '', depto: 'Compras', msg: '' }
const DEPARTAMENTOS = ['Compras', 'Ventas', 'Envíos', 'Mi cuenta', 'Otro']

const Obligatorio = ({ children }) => <>{children} <span className="req">*</span></>

// Formulario de contacto. Hoy el envío es simulado: valida, avisa con un toast y limpia el formulario.
// Cuando exista un endpoint para recibir mensajes, se llama desde `enviar` antes del toast.
const ContactForm = () => {
  const toast = useToast()
  const { valores, cambiar, error, setError, reiniciar } = useFormulario(INICIAL)

  const enviar = (e) => {
    e.preventDefault()
    const mensaje = validarContacto(valores)
    if (mensaje) return setError(mensaje)
    reiniciar()
    toast('¡Mensaje enviado! Te respondemos pronto.')
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <div className="two">
        <Field label={<Obligatorio>Nombre</Obligatorio>} name="nombre" value={valores.nombre} onChange={cambiar} autoComplete="given-name" />
        <Field label={<Obligatorio>Apellido</Obligatorio>} name="apellido" value={valores.apellido} onChange={cambiar} autoComplete="family-name" />
      </div>
      <Field label={<Obligatorio>Correo</Obligatorio>} name="email" type="email" value={valores.email} onChange={cambiar} autoComplete="email" />
      <div className="two">
        <Field label="Código de área" name="area" value={valores.area} onChange={cambiar} placeholder="+54" inputMode="tel" />
        <Field label="Teléfono" name="tel" type="tel" value={valores.tel} onChange={cambiar} autoComplete="tel-national" />
      </div>
      <SelectField label={<Obligatorio>Departamento/Sección</Obligatorio>} name="depto" value={valores.depto} onChange={cambiar} opciones={DEPARTAMENTOS} />
      <TextAreaField label={<Obligatorio>Mensaje</Obligatorio>} name="msg" value={valores.msg} onChange={cambiar} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Enviar mensaje</button>
    </form>
  )
}

export default ContactForm
