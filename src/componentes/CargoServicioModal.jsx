import useFormulario from '../hooks/useFormulario'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import Field from './Field'

// Cambiar el porcentaje del cargo de servicio. El back valida el rango (0 a 30, hasta 2 decimales) y, si no es válido,
// devuelve el error del campo `porcentaje`. `onGuardar(porcentaje)` devuelve (una Promesa de) { ok } o { error, campos }.
const CargoServicioModal = ({ porcentajeActual, onGuardar, onCerrar }) => {
  const f = useFormulario({ porcentaje: porcentajeActual == null ? '' : String(porcentajeActual).replace('.', ',') })

  const enviar = async (e) => {
    e.preventDefault()
    const texto = f.valores.porcentaje.trim().replace(',', '.')
    const r = await onGuardar(texto === '' ? null : Number(texto))
    if (r.error) {
      if (r.campos && r.campos.porcentaje) return f.setErroresCampos({ porcentaje: r.campos.porcentaje })
      return f.setError(r.error, 'DESCONOCIDO')
    }
    onCerrar()
  }

  return (
    <AdminModal titulo="Cargo de servicio" onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <Field label="Porcentaje sobre el precio de los libros (%)" name="porcentaje" inputMode="decimal" autoComplete="off"
          value={f.valores.porcentaje} onChange={f.cambiar} error={f.errores.porcentaje} />
        <small className="dim">Se aplica a las compras que se confirmen desde ahora. Las órdenes ya creadas conservan su cargo.</small>
        <Aviso mensaje={f.error} tipo={f.tipoError} />
        <div className="modal-btns">
          <button className="btn main" type="submit">Guardar porcentaje</button>
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </AdminModal>
  )
}

export default CargoServicioModal
