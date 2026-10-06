import CategoriaForm from './CategoriaForm'

// Tarjeta de alta de categoría (nombre + foto opcional). `onCrear({ nombre, imagen })` devuelve { ok } o { error }.
const NuevaCategoriaForm = ({ onCrear }) => (
  <div className="card">
    <h3 className="fr adm-card-t">Nueva categoría</h3>
    <CategoriaForm onGuardar={onCrear} />
  </div>
)

export default NuevaCategoriaForm
