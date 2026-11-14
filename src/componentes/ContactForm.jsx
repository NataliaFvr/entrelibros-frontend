import { useDispatch, useSelector } from 'react-redux'
import useFormulario from '../hooks/useFormulario'
import { enviarContacto } from '../redux/contactoSlice'
import { mostrarToast } from '../redux/toastSlice'
import { mapearCampos } from '../utils/errorApi'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

const INICIAL = { nombre: '', apellido: '', email: '', area: '', telefono: '', departamento: 'Compras', mensaje: '' }
const DEPARTAMENTOS = ['Compras', 'Ventas', 'Envíos', 'Mi cuenta', 'Otro']

const Obligatorio = ({ children }) => <>{children} <span className="req">*</span></>

// Formulario de contacto. El backend recibe y valida todos los campos del formulario.
const ContactForm = () => {
  const dispatch = useDispatch()
  const enviando = useSelector((state) => state.contacto.enviando)
  const { valores, cambiar, error, setError, reiniciar, errores, setErroresCampos } = useFormulario(INICIAL)
  const campo = (n) => ({ name: n, value: valores[n], onChange: cambiar, error: errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    const resultado = await dispatch(enviarContacto({
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      email: valores.email.trim(),
      area: valores.area.trim(),
      telefono: valores.telefono.trim(),
      departamento: valores.departamento,
      mensaje: valores.mensaje.trim(),
    }))
    if (resultado.error) {
      const campos = mapearCampos(resultado.error.campos, {
        nombre: 'nombre', apellido: 'apellido', email: 'email', area: 'area', telefono: 'telefono', departamento: 'departamento', mensaje: 'mensaje',
      })
      if (Object.keys(campos).length) return setErroresCampos(campos)
      return setError(resultado.error.message)
    }
    setError('')
    reiniciar()
    dispatch(mostrarToast({ msg: '¡Mensaje enviado! Te respondemos pronto.' }))
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
        <Field label="Teléfono" type="tel" {...campo('telefono')} autoComplete="tel-national" />
      </div>
      <SelectField label={<Obligatorio>Departamento/Sección</Obligatorio>} name="departamento" value={valores.departamento} onChange={cambiar} opciones={DEPARTAMENTOS} />
      <TextAreaField label={<Obligatorio>Mensaje</Obligatorio>} {...campo('mensaje')} />
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar mensaje'}</button>
    </form>
  )
}

export default ContactForm