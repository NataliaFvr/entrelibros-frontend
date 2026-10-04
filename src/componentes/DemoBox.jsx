import useIngresoDemo from '../hooks/useIngresoDemo'
import { INGRESOS_DEMO } from '../data/cuentasDemo'

// Panel lateral: entra directo con una cuenta de prueba (comprador o vendedor)
const DemoBox = ({ onElegirDestino }) => {
  const entrar = useIngresoDemo(onElegirDestino)
  return (
    <div className="au-side">
      <h3 className="fr">Probá la demo</h3>
      <p>Las cuentas de esta versión se guardan solo en este navegador.</p>
      {INGRESOS_DEMO.map((cuenta) => (
        <button key={cuenta.id} className="btn alt" type="button" onClick={() => entrar(cuenta)}>{cuenta.texto}</button>
      ))}
    </div>
  )
}

export default DemoBox
