import { useState } from 'react'
import useAdminEnvios from '../hooks/useAdminEnvios'
import { TIPOS_ENVIO } from '../data/envios'
import { fmt } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import CostoEnvioModal from '../componentes/CostoEnvioModal'
import ShipCard from '../componentes/ShipCard'

// /admin/envios — cuánto cuesta el envío; el cambio se ve enseguida en el carrito y en Políticas de envío
const AdminEnviosPage = () => {
  const { tarifas, cambiar } = useAdminEnvios()
  const [editando, setEditando] = useState(null) // un elemento de TIPOS_ENVIO

  return (
    <main className="usr">
      <AdminHead seccion="Tarifas de envío" titulo="Tarifas de envío" sub="Cuánto cuesta que los libros lleguen a casa." />
      <div className="ship-grid" style={{ marginTop: 0 }}>
        {TIPOS_ENVIO.map((t) => (
          <ShipCard key={t.tipo} titulo={t.titulo} precio={fmt(tarifas[t.tipo])} variante={t.variante}
            accion={<button className="btn alt adm-sm" type="button" onClick={() => setEditando(t)}>Cambiar precio</button>}>
            {t.textoAdmin}
          </ShipCard>
        ))}
      </div>
      <div className="card ship-once">
        <h3 className="fr">Varios libros, un solo envío</h3>
        <p>Si el comprador lleva muchos libros de una misma provincia, ese precio se cobra una sola vez, sin importar cuántos libros sean.</p>
        <small>Ejemplo: 3 libros de vendedores de Santa Fe, comprando desde Córdoba, pagan un único envío de {fmt(tarifas.distinta)}.</small>
      </div>
      {editando && (
        <CostoEnvioModal titulo={editando.titulo} costoActual={tarifas[editando.tipo]}
          onGuardar={(costo) => cambiar(editando.tipo, costo)} onCerrar={() => setEditando(null)} />
      )}
    </main>
  )
}

export default AdminEnviosPage
