import Field from './Field'

const CardFields = ({ valores, onChange, onCompletar }) => {
  return (
    <div className="pm-body">
      <Field label="Número de tarjeta" name="numero" value={valores.numero} onChange={onChange}
        inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
      <Field label="Nombre del titular" name="titular" value={valores.titular} onChange={onChange} autoComplete="cc-name" />
      <div className="two">
        <Field label="Vencimiento (MM/AA)" name="venc" value={valores.venc} onChange={onChange}
          inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" />
        <Field label="Código de seguridad" name="cvv" type="password" value={valores.cvv} onChange={onChange}
          inputMode="numeric" autoComplete="cc-csc" placeholder="•••" />
      </div>
      <small className="dim">No guardamos los datos de tu tarjeta.</small>
      <button className="lnk" type="button" style={{ alignSelf: 'flex-start' }} onClick={onCompletar}>Completar con tarjeta de prueba</button>
    </div>
  )
}

export default CardFields
