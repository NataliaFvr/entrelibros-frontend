import { Link } from 'react-router-dom'
import { AYUDA, AYUDA_RAIZ } from '../data/ayuda'
import { COSTO_ENVIO } from '../utils/envio'
import { fmt } from '../utils/format'
import InfoLayout from '../componentes/InfoLayout'
import ShipCard from '../componentes/ShipCard'
import TruckLane from '../componentes/TruckLane'

const ShippingPolicyPage = () => {
  const { label, sub } = AYUDA.envios
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label: 'Ayuda', to: AYUDA_RAIZ }, { label }]} pie={<TruckLane />}>
      <div className="info-wrap">
        <div className="ship-grid" style={{ marginTop: 0 }}>
          <ShipCard titulo="Misma provincia que el vendedor" precio={fmt(COSTO_ENVIO.misma)}>
            Si vivís en la misma provincia que quien vende el libro, el envío tiene este precio.
          </ShipCard>
          <ShipCard titulo="Distinta provincia" precio={fmt(COSTO_ENVIO.distinta)} variante="d">
            Si el vendedor está en otra provincia, el envío tiene este precio.
          </ShipCard>
        </div>
        <div className="card ship-once">
          <h3 className="fr">Varios libros, un solo envío</h3>
          <p>Si comprás muchos libros de una misma provincia, ese precio se cobra una sola vez, sin importar cuántos libros sean.</p>
          <small>Ejemplo: 3 libros de vendedores de Santa Fe, comprando desde Córdoba, pagan un único envío de {fmt(COSTO_ENVIO.distinta)}.</small>
        </div>
        <p className="info-more" style={{ textAlign: 'center', fontSize: '.85rem', opacity: 0.7 }}>
          El costo final se calcula al finalizar la compra, según la dirección que elijas. ¿Dudas? <Link to={AYUDA.contacto.to}>Contáctanos</Link>
        </p>
      </div>
    </InfoLayout>
  )
}

export default ShippingPolicyPage
