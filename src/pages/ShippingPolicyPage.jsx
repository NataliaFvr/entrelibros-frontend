import { Link } from 'react-router-dom'
import { AYUDA, AYUDA_RAIZ } from '../data/ayuda'
import useTarifasEnvio from '../hooks/useTarifasEnvio'
import { fmt } from '../utils/format'
import { TIPOS_ENVIO } from '../data/envios'
import InfoLayout from '../componentes/InfoLayout'
import ShipCard from '../componentes/ShipCard'
import TruckLane from '../componentes/TruckLane'

const precio = (n) => (n != null ? fmt(n) : '…')

const ShippingPolicyPage = () => {
  const { label, sub } = AYUDA.envios
  const tarifas = useTarifasEnvio()
  return (
    <InfoLayout titulo={label} sub={sub} migas={[{ label: 'Ayuda', to: AYUDA_RAIZ }, { label }]} pie={<TruckLane />}>
      <div className="info-wrap">
        <div className="ship-grid" style={{ marginTop: 0 }}>
          {TIPOS_ENVIO.map(({ tipo, titulo, variante, texto }) => (
            <ShipCard key={tipo} titulo={titulo} precio={precio(tarifas[tipo])} variante={variante}>{texto}</ShipCard>
          ))}
        </div>
        <div className="card ship-once">
          <h3 className="fr">Un envío por vendedor</h3>
          <p>Si comprás varios libros del mismo vendedor, pagás un solo envío por ese vendedor, sin importar cuántos libros sean.</p>
          <small>Ejemplo: 3 libros de una librería de Santa Fe, comprando desde Córdoba, pagan un único envío de {precio(tarifas.distinta)}.</small>
        </div>
        <p className="info-more" style={{ textAlign: 'center', fontSize: '.85rem', opacity: 0.7 }}>
          El costo final se calcula al finalizar la compra, según la dirección que elijas. ¿Dudas? <Link to={AYUDA.contacto.to}>Contáctanos</Link>
        </p>
      </div>
    </InfoLayout>
  )
}

export default ShippingPolicyPage
