import Field from './Field'

const soloDigitos = (texto) => texto.replace(/\D/g, '')

// Da formato mientras se escribe: el número en grupos de 4, la barra del vencimiento sola y el código solo con números.
// Al borrar, la barra no vuelve a aparecer (si no, no se podría borrar el mes).
const formatear = (nombre, valor, anterior) => {
  if (nombre === 'numeroTarjeta') return soloDigitos(valor).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
  if (nombre === 'codigoSeguridad') return soloDigitos(valor).slice(0, 4)
  if (nombre === 'vencimiento') {
    const d = soloDigitos(valor).slice(0, 4)
    if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`
    return d.length === 2 && valor.length > anterior.length ? `${d}/` : d
  }
  return valor
}

// Los nombres son los de PagoRequest; los errores (`errores`) los manda el back
const CardFields = ({ valores, errores = {}, onChange: cambiar, onCompletar }) => {
  const onChange = (nombre, valor) => cambiar(nombre, formatear(nombre, valor, valores[nombre] || ''))
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
