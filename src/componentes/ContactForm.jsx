import useFormulario from '../hooks/useFormulario'
import { useToast } from '../hooks/useToast'
import { enviarContactoApi } from '../api/cuentaApi'
import { mapearCampos, mensajeError, normalizarError } from '../utils/errorApi'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

const INICIAL = { nombre: '', apellido: '', email: '', area: '', tel: '', depto: 'Compras', msg: '' }
const DEPARTAMENTOS = ['Compras', 'Ventas', 'Envíos', 'Mi cuenta', 'Otro']

const Obligatorio = ({ children }) => <>{children} <span className="req">*</span></>

// Formulario de contacto. El backend recibe y valida todos los campos del formulario.
const ContactForm = () => {
  const toast = useToast()
  const { valores, cambiar, error, setError, reiniciar, errores, setErroresCampos } = useFormulario(INICIAL)
  const campo = (n) => ({ name: n, value: valores[n], onChange: cambiar, error: errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    try {
      await enviarContactoApi({
        nombre: valores.nombre.trim(),
        apellido: valores.apellido.trim(),
        email: valores.email.trim(),
        area: valores.area.trim(),
        telefono: valores.tel.trim(),
        departamento: valores.depto,
        mensaje: valores.msg.trim(),
      })
    } catch (err) {
      const campos = mapearCampos(normalizarError(err).campos, {
        nombre: 'nombre', apellido: 'apellido', email: 'email', area: 'area', telefono: 'tel', departamento: 'depto', mensaje: 'msg',
      })
      if (Object.keys(campos).length) return setErroresCampos(campos)
      return setError(mensajeError(err))
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
      <TextAreaField label={<Obligatorio>Mensaje</Obligatorio>} {...campo('msg')} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Enviar mensaje</button>
    </form>
  )
}

export default ContactForm
