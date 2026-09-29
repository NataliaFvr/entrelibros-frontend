import { useAuth } from '../hooks/useAuth'

// Panel lateral: entra directo con la cuenta de prueba
const DemoBox = ({ onListo }) => {
  const { login } = useAuth()
  const entrarDemo = () => {
    if (!login('usuario_prueba', 'Clave123!')) onListo()
  }
  return (
    <div className="au-side">
      <h3 className="fr">Probá la demo</h3>
      <p>Las cuentas de esta versión se guardan solo en este navegador.</p>
      <button className="btn alt" type="button" onClick={entrarDemo}>Entrar como comprador de prueba</button>
    </div>
  )
}

export default DemoBox
