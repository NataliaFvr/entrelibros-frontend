import { useState } from 'react'
import useAdminEnvios from '../hooks/useAdminEnvios'
import { TIPOS_ENVIO } from '../data/envios'
import { fmt } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import CostoEnvioModal from '../componentes/CostoEnvioModal'
import ShipCard from '../componentes/ShipCard'

const precio = (n) => (n != null ? fmt(n) : '…')

// /admin/envios — cuánto cuesta el envío; el cambio se ve enseguida en el carrito y en Políticas de envío
const AdminEnviosPage = () => {
  const { tarifas, cambiar } = useAdminEnvios()
  const [editando, setEditando] = useState(null) // un elemento de TIPOS_ENVIO

  return (
    <main className="usr">
      <AdminHead seccion="Tarifas de envío" titulo="Tarifas de envío" sub="Cuánto cuesta que los libros lleguen a casa." />
      <div className="ship-grid" style={{ marginTop: 0 }}>
        {TIPOS_ENVIO.map((t) => (
          <ShipCard key={t.tipo} titulo={t.titulo} precio={precio(tarifas[t.tipo])} variante={t.variante}
            accion={<button className="btn alt adm-sm" type="button" disabled={tarifas[t.tipo] == null} onClick={() => setEditando(t)}>Cambiar precio</button>}>
            {t.textoAdmin}
          </ShipCard>
        ))}
      </div>
      <div className="card ship-once">
        <h3 className="fr">Un envío por vendedor</h3>
        <p>Si el comprador lleva varios libros del mismo vendedor, paga un solo envío por ese vendedor, sin importar cuántos libros sean.</p>
        <small>Ejemplo: 3 libros de una librería de Santa Fe, comprando desde Córdoba, pagan un único envío de {precio(tarifas.distinta)}.</small>
      </div>
      {editando && (
        <CostoEnvioModal titulo={editando.titulo} costoActual={tarifas[editando.tipo]}
          onGuardar={(costo) => cambiar(editando.tipo, costo)} onCerrar={() => setEditando(null)} />
      )}
    </main>
  )
}

export default AdminEnviosPage
