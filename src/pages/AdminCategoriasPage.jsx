import { useState } from 'react'
import useAdminCategorias from '../hooks/useAdminCategorias'
import AdminHead from '../componentes/AdminHead'
import AdminModal from '../componentes/AdminModal'
import Aviso from '../componentes/Aviso'
import CategoriaForm from '../componentes/CategoriaForm'
import CategoriasActuales from '../componentes/CategoriasActuales'
import NuevaCategoriaForm from '../componentes/NuevaCategoriaForm'

// /admin/categorias — las categorías organizan el catálogo: se crean con foto, se editan y se dan de baja (sin borrarlas)
const AdminCategoriasPage = () => {
  const { categorias, crear, editar, darDeBaja, reactivar } = useAdminCategorias()
  const [editando, setEditando] = useState(null)
  const [baja, setBaja] = useState(null)
  const [errorBaja, setErrorBaja] = useState('')

  const confirmarBaja = async () => {
    const r = await darDeBaja(baja.nombre)
    if (r.error) setErrorBaja(r.error)
    else { setBaja(null); setErrorBaja('') }
  }

  return (
    <main className="usr">
      <AdminHead seccion="Categorías" titulo="Categorías" sub="Creá categorías con foto, editalas o dalas de baja: las de baja no aparecen en el catálogo ni al publicar, y se pueden reactivar." />
      <div className="adm-split">
        <CategoriasActuales categorias={categorias} onEditar={setEditando} onBaja={setBaja} onReactivar={(c) => reactivar(c.nombre)} />
        <NuevaCategoriaForm onCrear={crear} />
      </div>
      {editando && (
        <AdminModal titulo={`Editar "${editando.nombre}"`} onCerrar={() => setEditando(null)}>
          <CategoriaForm inicial={editando} onGuardar={(d) => editar(editando.nombre, d)} onListo={() => setEditando(null)} onCancelar={() => setEditando(null)} />
        </AdminModal>
      )}
      {baja && (
        <AdminModal titulo={`¿Dar de baja "${baja.nombre}"?`} onCerrar={() => { setBaja(null); setErrorBaja('') }}>
          <p className="note">Deja de ofrecerse en el catálogo, el inicio y al publicar libros. Los libros que ya la tienen no se borran, y podés reactivarla cuando quieras.</p>
          <Aviso mensaje={errorBaja} tipo="DESCONOCIDO" />
          <div className="modal-btns">
            <button className="btn main" type="button" onClick={confirmarBaja}>Dar de baja</button>
            <button className="btn alt" type="button" onClick={() => { setBaja(null); setErrorBaja('') }}>Cancelar</button>
          </div>
        </AdminModal>
      )}
    </main>
  )
}

export default AdminCategoriasPage
