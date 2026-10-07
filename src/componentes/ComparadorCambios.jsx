import { CAMPOS_COMPARADOS, camposCambiados, textoCampo } from '../utils/compararLibro'

const Columna = ({ titulo, datos, cambiados = new Set(), propuesta = false }) => (
  <section className={`cmp-col${propuesta ? ' new' : ''}`} aria-label={titulo}>
    <h4 className="fr">{titulo}</h4>
    <dl>
      {CAMPOS_COMPARADOS.map(([campo, etiqueta]) => {
        if (campo === 'imagenUrl' && !datos.imagenUrl) return null
        const cambio = cambiados.has(campo)
        return (
          <div key={campo} className={`cmp-row${cambio ? ' chg' : ''}`}>
            <dt>{etiqueta}{cambio && propuesta && <span className="cmp-flag">Cambió</span>}</dt>
            <dd>
              {campo === 'imagenUrl'
                ? <img className="cmp-img" src={datos.imagenUrl} alt={`Portada ${propuesta ? 'propuesta' : 'actual'}`} />
                : textoCampo(campo, datos[campo])}
            </dd>
          </div>
        )
      })}
    </dl>
  </section>
)

// Con `actuales` compara lado a lado y resalta lo que cambió (en ambas columnas, y con la marca "Cambió" además del color).
// Sin `actuales` (publicación nueva) muestra solo los datos del libro. En celular las columnas se apilan.
const ComparadorCambios = ({ actuales, propuestos }) => {
  if (!actuales) {
    return <div className="cmp solo"><Columna titulo="Datos del libro" datos={propuestos} propuesta /></div>
  }
  const cambiados = camposCambiados(actuales, propuestos)
  return (
    <>
      <p className="cmp-resumen" role="status">
        {cambiados.size ? `${cambiados.size} ${cambiados.size === 1 ? 'campo cambió' : 'campos cambiaron'}` : 'No hay diferencias en los datos.'}
      </p>
      <div className="cmp">
        <Columna titulo="Datos actuales" datos={actuales} cambiados={cambiados} />
        <Columna titulo="Datos propuestos" datos={propuestos} cambiados={cambiados} propuesta />
      </div>
    </>
  )
}

export default ComparadorCambios
