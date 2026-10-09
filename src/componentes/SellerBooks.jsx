import { useNavigate } from 'react-router-dom'
import EmptyBlock from './EmptyBlock'
import SellerBookRow from './SellerBookRow'

// estado: 'cargando' | 'ok' | 'error' (ver useMisLibros).
// El vacío ("Todavía no publicaste libros") solo se muestra con estado 'ok': el back respondió que no hay libros.
// Si la carga falló (red, servidor…) se muestra un bloque de error con "Reintentar" y el motivo sale en el toast.
const SellerBooks = ({ libros, estado = 'ok', onReintentar, onBaja }) => {
  const navigate = useNavigate()

  if (!libros.length) {
    if (estado === 'cargando') return <p className="sell-note" role="status">Cargando tus libros…</p>
    if (estado === 'error') {
      return <EmptyBlock tipo="error" titulo="No pudimos cargar tus libros" texto="Hubo un problema al consultar tus publicaciones. Revisá el aviso e intentá de nuevo." boton="Reintentar" onClick={onReintentar} />
    }
    return <EmptyBlock titulo="Todavía no publicaste libros" texto="Publicá el primero para que aparezca en el catálogo." boton="Publicar libro" onClick={() => navigate('/vender/nuevo')} />
  }
  return (
    <>
      {libros.map((p) => (
        <SellerBookRow key={p.id} libro={p} onEditar={() => navigate(`/vender/editar/${p.id}`)} onBaja={() => onBaja(p.id)} />
      ))}
      <p className="sell-note">Dar de baja oculta el libro del catálogo pero conserva su historial: las compras y opiniones anteriores no se pierden.</p>
    </>
  )
}

export default SellerBooks
