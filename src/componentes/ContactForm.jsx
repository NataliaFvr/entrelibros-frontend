import useFormulario from '../hooks/useFormulario'
import { useToast } from '../hooks/useToast'
import { validarContacto } from '../utils/validaciones'
import { enviarContactoApi } from '../api/cuentaApi'
import { mensajeError } from '../utils/errorApi'
import { USAR_API } from '../utils/modoApi'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

const INICIAL = { nombre: '', apellido: '', email: '', area: '', tel: '', depto: 'Compras', msg: '' }
const DEPARTAMENTOS = ['Compras', 'Ventas', 'Envíos', 'Mi cuenta', 'Otro']

const Obligatorio = ({ children }) => <>{children} <span className="req">*</span></>

// Formulario de contacto. Con el back: POST /contacto { nombre, email, mensaje } (el back no guarda apellido, teléfono ni departamento:
// se agregan al texto del mensaje para no perderlos). Sin el back el envío es simulado.
const ContactForm = () => {
  const toast = useToast()
  const { valores, cambiar, error, setError, reiniciar } = useFormulario(INICIAL)

  const enviar = async (e) => {
    e.preventDefault()
    const mensaje = validarContacto(valores)
    if (mensaje) return setError(mensaje)
    if (USAR_API) {
      const contacto = [valores.area || valores.tel ? `Tel: ${`${valores.area} ${valores.tel}`.trim()}` : '', `Departamento: ${valores.depto}`].filter(Boolean).join(' · ')
      try {
        await enviarContactoApi({ nombre: `${valores.nombre} ${valores.apellido}`.trim(), email: valores.email.trim(), mensaje: `${valores.msg.trim()}\n\n${contacto}` })
      } catch (err) {
        return setError(mensajeError(err)) // incluye los errores de validación del back (email inválido, mensaje vacío…)
      }
    }
    setError('')
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
