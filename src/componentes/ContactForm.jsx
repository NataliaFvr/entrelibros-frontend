import useFormulario from '../hooks/useFormulario'
import { useToast } from '../hooks/useToast'
import { MENSAJE_MAX, validadoresContacto } from '../utils/validaciones'
import { enviarContactoApi } from '../api/cuentaApi'
import { mapearCampos, mensajeError, normalizarError } from '../utils/errorApi'
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
  const { valores, cambiar, error, setError, reiniciar, errores, alSalir, validarTodo, setErroresCampos } = useFormulario(INICIAL, validadoresContacto)
  const campo = (n) => ({ name: n, value: valores[n], onChange: cambiar, onBlur: alSalir, error: errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    if (Object.keys(validarTodo(e.currentTarget)).length) return setError('')
    if (USAR_API) {
      const contacto = [valores.area || valores.tel ? `Tel: ${`${valores.area} ${valores.tel}`.trim()}` : '', `Departamento: ${valores.depto}`].filter(Boolean).join(' · ')
      try {
        await enviarContactoApi({ nombre: `${valores.nombre} ${valores.apellido}`.trim(), email: valores.email.trim(), mensaje: `${valores.msg.trim()}\n\n${contacto}` })
      } catch (err) {
        const campos = mapearCampos(normalizarError(err).campos, { nombre: 'nombre', email: 'email', mensaje: 'msg' })
        if (Object.keys(campos).length) return setErroresCampos(campos) // validación del back por campo
        return setError(mensajeError(err))
      }
    }
    setError('')
    reiniciar()
    toast('¡Mensaje enviado! Te respondemos pronto.')
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <div className="two">
        <Field label={<Obligatorio>Nombre</Obligatorio>} {...campo('nombre')} autoComplete="given-name" />
        <Field label={<Obligatorio>Apellido</Obligatorio>} {...campo('apellido')} autoComplete="family-name" />
      </div>
      <Field label={<Obligatorio>Correo</Obligatorio>} type="email" {...campo('email')} autoComplete="email" />
      <div className="two">
        <Field label="Código de área" {...campo('area')} placeholder="+54" inputMode="tel" />
        <Field label="Teléfono" type="tel" {...campo('tel')} autoComplete="tel-national" />
      </div>
      <SelectField label={<Obligatorio>Departamento/Sección</Obligatorio>} name="depto" value={valores.depto} onChange={cambiar} opciones={DEPARTAMENTOS} />
      <TextAreaField label={<Obligatorio>Mensaje</Obligatorio>} max={MENSAJE_MAX} {...campo('msg')} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Enviar mensaje</button>
    </form>
  )
}

export default ContactForm
