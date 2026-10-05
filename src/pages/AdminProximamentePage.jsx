import { useNavigate } from 'react-router-dom'
import AdminHead from '../componentes/AdminHead'
import EmptyBlock from '../componentes/EmptyBlock'

// Secciones de la barra que todavía no tienen pantalla (Categorías, Tarifas de envío, Órdenes y Pagos)
const AdminProximamentePage = ({ seccion }) => {
  const navigate = useNavigate()
  return (
    <main className="usr">
      <AdminHead seccion={seccion} titulo={seccion} sub="Esta sección se arma en una próxima entrega." />
      <EmptyBlock titulo="Todavía no está lista" texto="Mientras tanto podés usar Resumen, Moderación y Usuarios." boton="Volver al resumen" onClick={() => navigate('/admin')} />
    </main>
  )
}

export default AdminProximamentePage
