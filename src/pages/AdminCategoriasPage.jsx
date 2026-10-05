import useAdminCategorias from '../hooks/useAdminCategorias'
import AdminHead from '../componentes/AdminHead'
import CategoriasActuales from '../componentes/CategoriasActuales'
import NuevaCategoriaForm from '../componentes/NuevaCategoriaForm'

// /admin/categorias — las categorías organizan el catálogo; por ahora solo se crean
const AdminCategoriasPage = () => {
  const { categorias, crear } = useAdminCategorias()
  return (
    <main className="usr">
      <AdminHead seccion="Categorías" titulo="Categorías" sub="Las categorías organizan el catálogo. Por ahora se pueden crear, no editar ni borrar." />
      <div className="adm-split">
        <CategoriasActuales categorias={categorias} />
        <NuevaCategoriaForm onCrear={crear} />
      </div>
    </main>
  )
}

export default AdminCategoriasPage
