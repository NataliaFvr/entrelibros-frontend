import { PROVINCIAS } from '../data/provincias'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import SelectField from './SelectField'
import TextAreaField from './TextAreaField'

// Solicitud para pasar a vendedor. El backend decide si los datos son válidos.
const SellerRequestForm = ({ onEnviar }) => {
  const f = useFormulario({ nombreTienda: '', provincia: 'Buenos Aires', telefono: '', descripcion: '' })
  const campo = (n) => ({ name: n, value: f.valores[n], onChange: f.cambiar, error: f.errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    const { nombreTienda, provincia, telefono, descripcion } = f.valores
    try {
      await onEnviar({ tienda: nombreTienda.trim(), prov: provincia, tel: telefono.trim(), desc: descripcion.trim() })
    } catch (err) {
      f.setError((err && err.message) || 'No pudimos enviar la solicitud. Intentá de nuevo.', 'DESCONOCIDO')
    }
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Solicitar ser vendedor</h3>
      <p className="sell-note">Un administrador verifica cada solicitud antes de habilitar la venta.</p>
      <Field label="Nombre de tu tienda" autoComplete="organization" {...campo('nombreTienda')} />
      <div className="two">
        <SelectField label="Provincia" opciones={PROVINCIAS} {...campo('provincia')} />
        <Field label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...campo('telefono')} />
      </div>
      <TextAreaField label="¿Qué libros vendés?" {...campo('descripcion')} />
      <p className="ferr" role="alert">{f.error}</p>
      <button className="btn main" type="submit">Enviar solicitud</button>
    </form>
  )
}

export default SellerRequestForm
