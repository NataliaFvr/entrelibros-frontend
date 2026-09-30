import { useNavigate } from 'react-router-dom'
import EmptyBlock from './EmptyBlock'
import SellerBookRow from './SellerBookRow'

const SellerBooks = ({ libros, onBaja, onAprobar }) => {
  const navigate = useNavigate()

  if (!libros.length) {
    return <EmptyBlock titulo="Todavía no publicaste libros" texto="Publicá el primero para que aparezca en el catálogo." boton="Publicar libro" onClick={() => navigate('/vender/nuevo')} />
  }
  return (
    <>
      {libros.map((p) => (
        <SellerBookRow key={p.id} libro={p} onEditar={() => navigate(`/vender/editar/${p.id}`)} onBaja={() => onBaja(p.id)} onAprobar={() => onAprobar(p.id)} />
      ))}
      <p className="sell-note">Dar de baja oculta el libro del catálogo pero conserva su historial: las compras y opiniones anteriores no se pierden.</p>
    </>
  )
}

export default SellerBooks
