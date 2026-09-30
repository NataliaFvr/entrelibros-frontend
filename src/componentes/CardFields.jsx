import { enmascarar } from '../utils/tarjeta'
import Field from './Field'

// `onChange(nombre, valor)`: acá se aplica el formato (grupos de 4, MM/AA, solo dígitos)
const CardFields = ({ valores, onChange, onCompletar }) => {
  const cambiar = (nombre, valor) => onChange(nombre, enmascarar(nombre, valor))
  return (
    <div className="pm-body">
      <Field label="Número de tarjeta" name="numero" value={valores.numero} onChange={cambiar}
        inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" maxLength={23} />
      <Field label="Nombre del titular" name="titular" value={valores.titular} onChange={cambiar} autoComplete="cc-name" />
      <div className="two">
        <Field label="Vencimiento (MM/AA)" name="venc" value={valores.venc} onChange={cambiar}
          inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" maxLength={5} />
        <Field label="Código de seguridad" name="cvv" type="password" value={valores.cvv} onChange={cambiar}
          inputMode="numeric" autoComplete="cc-csc" maxLength={4} placeholder="•••" />
      </div>
      <small className="dim">No guardamos los datos de tu tarjeta.</small>
      <button className="lnk" type="button" style={{ alignSelf: 'flex-start' }} onClick={onCompletar}>Completar con tarjeta de prueba</button>
    </div>
  )
}

export default CardFields
