import { PROVINCIAS } from '../data/provincias'
import useFormulario from '../hooks/useFormulario'
import { validadoresSolicitudVendedor } from '../utils/validaciones'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

// Solicitud para pasar a vendedor. El back (SolicitudVendedorRequest) solo exige nombreTienda; el resto se valida acá con reglas básicas.
// `onEnviar` puede devolver una promesa; si falla, el mensaje de error queda bajo el formulario.
const SellerRequestForm = ({ onEnviar }) => {
  const f = useFormulario({ tienda: '', prov: 'Buenos Aires', tel: '', desc: '' }, validadoresSolicitudVendedor)
  const campo = (n) => ({ name: n, value: f.valores[n], onChange: f.cambiar, onBlur: f.alSalir, error: f.errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    if (Object.keys(f.validarTodo(e.currentTarget)).length) return f.setError('')
    const { tienda, prov, tel, desc } = f.valores
    try {
      await onEnviar({ tienda: tienda.trim(), prov, tel: tel.trim(), desc: desc.trim() })
    } catch (err) {
      f.setError((err && err.message) || 'No pudimos enviar la solicitud. Intentá de nuevo.', 'DESCONOCIDO')
    }
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Solicitar ser vendedor</h3>
      <p className="sell-note">Un administrador verifica cada solicitud antes de habilitar la venta.</p>
      <Field label="Nombre de tu tienda" maxLength={60} autoComplete="organization" {...campo('tienda')} />
      <div className="two">
        <SelectField label="Provincia" opciones={PROVINCIAS} {...campo('prov')} />
        <Field label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...campo('tel')} />
      </div>
      <TextAreaField label="¿Qué libros vendés?" max={500} {...campo('desc')} />
      <p className="ferr" role="alert">{f.error}</p>
      <button className="btn main" type="submit">Enviar solicitud</button>
    </form>
  )
}

export default SellerRequestForm
