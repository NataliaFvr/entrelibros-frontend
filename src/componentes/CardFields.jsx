import Field from './Field'

// Los nombres son los de PagoRequest; los errores (`errores`) los manda el back
const CardFields = ({ valores, errores = {}, onChange, onCompletar }) => {
  return (
    <div className="pm-body">
      <Field label="Número de tarjeta" name="numeroTarjeta" value={valores.numeroTarjeta} onChange={onChange} error={errores.numeroTarjeta}
        inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
      <Field label="Nombre del titular" name="titular" value={valores.titular} onChange={onChange} error={errores.titular} autoComplete="cc-name" />
      <div className="two">
        <Field label="Vencimiento (MM/AA)" name="vencimiento" value={valores.vencimiento} onChange={onChange} error={errores.vencimiento}
          inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" />
        <Field label="Código de seguridad" name="codigoSeguridad" type="password" value={valores.codigoSeguridad} onChange={onChange} error={errores.codigoSeguridad}
          inputMode="numeric" autoComplete="cc-csc" placeholder="•••" />
      </div>
      <small className="dim">No guardamos los datos de tu tarjeta.</small>
      <button className="lnk" type="button" style={{ alignSelf: 'flex-start' }} onClick={onCompletar}>Completar con tarjeta de prueba</button>
    </div>
  )
}

export default CardFields
