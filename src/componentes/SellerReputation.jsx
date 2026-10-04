import { useState } from 'react'
import RatingsBlock from './RatingsBlock'

const POR_PAGINA = 5

// Pestaña "Reputación" (Mis calificaciones): lo recibido por la atención y por cada libro
const SellerReputation = ({ calificaciones }) => {
  const { atencion, libros, cargando } = calificaciones
  const [cantAtencion, setCantAtencion] = useState(POR_PAGINA)
  const [cantLibros, setCantLibros] = useState(POR_PAGINA)

  return (
    <>
      <RatingsBlock titulo="Calificaciones a tu atención" vacio="Todavía no tenés reseñas. Los compradores pueden calificarte desde su historial de compras."
        resenias={atencion.resenias} promedio={atencion.promedio} cantidad={cantAtencion} onMas={() => setCantAtencion(cantAtencion + POR_PAGINA)} />
      {cargando
        ? <p className="sell-note" role="status">Cargando opiniones de tus libros…</p>
        : <RatingsBlock titulo="Opiniones de tus libros" vacio="Tus libros todavía no tienen opiniones." deLibros
            resenias={libros.resenias} promedio={libros.promedio} cantidad={cantLibros} onMas={() => setCantLibros(cantLibros + POR_PAGINA)} />}
    </>
  )
}

export default SellerReputation
