import { useState } from 'react'
import useAdminEnvios from '../hooks/useAdminEnvios'
import { TIPOS_ENVIO } from '../data/envios'
import { fmt } from '../utils/format'
import AdminHead from '../componentes/AdminHead'
import CostoEnvioModal from '../componentes/CostoEnvioModal'
import ShipCard from '../componentes/ShipCard'

// Mientras carga muestra "…"; si el back ya respondió y no hay tarifa, "Sin definir"
const precio = (n, cargada) => (n != null ? fmt(n) : cargada ? 'Sin definir' : '…')

// /admin/envios — cuánto cuesta el envío. Si falta alguna tarifa se crea desde acá (POST /envios);
// si ya existe se cambia el precio (PATCH /envios/{id}). El cambio se ve enseguida en el carrito y en Políticas de envío.
const AdminEnviosPage = () => {
  const { tarifas, cargada, cambiar, crear } = useAdminEnvios()
  const [editando, setEditando] = useState(null) // un elemento de TIPOS_ENVIO
  const faltan = cargada ? TIPOS_ENVIO.filter((t) => tarifas[t.tipo] == null) : []

  return (
    <main className="usr">
      <AdminHead seccion="Tarifas de envío" titulo="Tarifas de envío" sub="Cuánto cuesta que los libros lleguen a casa." />
      {faltan.length > 0 && (
        <div className="aviso aviso-warning" role="status" style={{ marginBottom: 16 }}>
          <b>{faltan.length === 1 ? 'Falta una tarifa por definir' : 'Faltan tarifas por definir'}</b>
          <span>
            Sin tarifa para: {faltan.map((t) => t.titulo).join(' · ')}. Mientras no exista, los compradores no pueden finalizar la compra porque el envío no se puede calcular.
          </span>
        </div>
      )}
      <div className="ship-grid" style={{ marginTop: 0 }}>
        {TIPOS_ENVIO.map((t) => {
          const existe = tarifas[t.tipo] != null
          return (
            <ShipCard key={t.tipo} titulo={t.titulo} precio={precio(tarifas[t.tipo], cargada)} variante={t.variante}
              accion={<button className={`btn ${existe ? 'alt' : 'main'} adm-sm`} type="button" disabled={!cargada} onClick={() => setEditando(t)}>
                {existe ? 'Cambiar precio' : 'Crear tarifa'}
              </button>}>
              {t.textoAdmin}
            </ShipCard>
          )
        })}
      </div>
      <div className="card ship-once">
        <h3 className="fr">Un envío por vendedor</h3>
        <p>Si el comprador lleva varios libros del mismo vendedor, paga un solo envío por ese vendedor, sin importar cuántos libros sean.</p>
        <small>Ejemplo: 3 libros de una librería de Santa Fe, comprando desde Córdoba, pagan un único envío de {tarifas.distinta != null ? fmt(tarifas.distinta) : 'la tarifa de distinta provincia'}.</small>
      </div>
      {editando && (
        <CostoEnvioModal titulo={tarifas[editando.tipo] != null ? editando.titulo : `Crear tarifa · ${editando.titulo}`} costoActual={tarifas[editando.tipo]}
          onGuardar={(costo) => (tarifas[editando.tipo] != null ? cambiar(editando.tipo, costo) : crear(editando.tipo, costo))}
          onCerrar={() => setEditando(null)} />
      )}
    </main>
  )
}

export default AdminEnviosPage
