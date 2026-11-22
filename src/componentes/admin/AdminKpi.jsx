import { Link } from 'react-router-dom'

// Número grande del panel. Con `to` es un acceso a esa sección; sin `to` solo informa.
const AdminKpi = ({ to, valor, etiqueta }) => {
  const contenido = (
    <>
      <b>{valor}</b>
      <small>{etiqueta}</small>
    </>
  )
  if (!to) return <div className="card adm-kpi adm-kpi-fijo">{contenido}</div>
  return <Link className="card adm-kpi" to={to}>{contenido}</Link>
}

export default AdminKpi
