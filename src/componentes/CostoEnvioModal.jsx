import useFormulario from '../hooks/useFormulario'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import Field from './Field'

// Crear o cambiar el costo de un tipo de envío (sin `costoActual` es una tarifa nueva). `onGuardar(costo)` devuelve (una Promesa de) { ok } o { error }.
const CostoEnvioModal = ({ titulo, costoActual, onGuardar, onCerrar }) => {
  const f = useFormulario({ costo: costoActual == null ? '' : String(costoActual) })

  const enviar = async (e) => {
    e.preventDefault()
    const r = await onGuardar(Number(f.valores.costo))
    if (r.error) f.setError(r.error, 'DESCONOCIDO')
    else onCerrar()
  }

  return (
    <AdminModal titulo={titulo} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <Field label="Costo del envío ($)" name="costo" inputMode="decimal" autoComplete="off"
          value={f.valores.costo} onChange={f.cambiar} error={f.errores.costo} />
        <Aviso mensaje={f.error} tipo={f.tipoError} />
        <div className="modal-btns">
          <button className="btn main" type="submit">{costoActual == null ? 'Crear tarifa' : 'Guardar precio'}</button>
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </AdminModal>
  )
}

export default CostoEnvioModal
