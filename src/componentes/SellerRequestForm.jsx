import { PROVINCIAS } from '../data/provincias'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import SelectField from './SelectField'

const SellerRequestForm = ({ onEnviar }) => {
  const { valores, cambiar, error, setError } = useFormulario({ tienda: '', prov: 'Buenos Aires', tel: '', desc: '' })

  const enviar = (e) => {
    e.preventDefault()
    if (!valores.tienda.trim() || !valores.tel.trim() || !valores.desc.trim()) return setError('Completá nombre de tienda, teléfono y descripción.')
    onEnviar({ tienda: valores.tienda.trim(), prov: valores.prov, tel: valores.tel.trim(), desc: valores.desc.trim() })
  }

  return (
    <form className="card aform" noValidate onSubmit={enviar}>
      <h3 className="fr">Solicitar ser vendedor</h3>
      <p className="sell-note">Un administrador verifica cada solicitud antes de habilitar la venta.</p>
      <Field label="Nombre de tu tienda" name="tienda" value={valores.tienda} onChange={cambiar} />
      <div className="two">
        <SelectField label="Provincia" name="prov" value={valores.prov} onChange={cambiar} opciones={PROVINCIAS} />
        <Field label="Teléfono" name="tel" type="tel" value={valores.tel} onChange={cambiar} autoComplete="tel" />
      </div>
      <label className="fld">
        ¿Qué libros vendés?
        <textarea name="desc" value={valores.desc} onChange={(e) => cambiar('desc', e.target.value)} />
      </label>
      <p className="ferr" role="alert">{error}</p>
      <button className="btn main" type="submit">Enviar solicitud</button>
    </form>
  )
}

export default SellerRequestForm
