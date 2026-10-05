import { Link } from 'react-router-dom'

// Número grande del resumen; al tocarlo lleva a la sección correspondiente.
const AdminKpi = ({ to, valor, etiqueta }) => {
  return (
    <Link className="card adm-kpi" to={to}>
      <b>{valor}</b>
      <small>{etiqueta}</small>
    </Link>
  )
}

export default AdminKpi
