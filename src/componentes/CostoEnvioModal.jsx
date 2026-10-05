import useFormulario from '../hooks/useFormulario'
import { aDecimal, validarPrecio } from '../utils/validaciones'
import AdminModal from './AdminModal'
import Aviso from './Aviso'
import Field from './Field'

// Cambiar el costo de un tipo de envío. `onGuardar(costo)` devuelve { ok } o { error }.
const CostoEnvioModal = ({ titulo, costoActual, onGuardar, onCerrar }) => {
  const f = useFormulario({ costo: String(costoActual) }, { costo: validarPrecio }, { enVivo: ['costo'] })

  const enviar = (e) => {
    e.preventDefault()
    if (Object.keys(f.validarTodo(e.currentTarget)).length) return
    const r = onGuardar(aDecimal(f.valores.costo))
    if (r.error) f.setError(r.error, 'DESCONOCIDO')
    else onCerrar()
  }

  return (
    <AdminModal titulo={titulo} onCerrar={onCerrar}>
      <form className="aform" noValidate onSubmit={enviar}>
        <Field label="Costo del envío ($)" name="costo" inputMode="decimal" autoComplete="off"
          value={f.valores.costo} onChange={f.cambiar} onBlur={f.alSalir} error={f.errores.costo} />
        <Aviso mensaje={f.error} tipo={f.tipoError} />
        <div className="modal-btns">
          <button className="btn main" type="submit">Guardar precio</button>
          <button className="btn alt" type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </AdminModal>
  )
}

export default CostoEnvioModal
