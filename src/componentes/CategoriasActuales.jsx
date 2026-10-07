import './CategoriasActuales.css'
import CategoriaCirculo from './CategoriaCirculo'

// Lista de categorías con su foto, estado y acciones. `categorias`: [{ nombre, imagen, activa }]
const CategoriasActuales = ({ categorias, onEditar, onBaja, onReactivar }) => {
  const activas = categorias.filter((c) => c.activa).length
  return (
    <div className="card">
      <h3 className="fr adm-card-t">Categorías ({activas} activas{categorias.length > activas ? `, ${categorias.length - activas} de baja` : ''})</h3>
      <ul className="cat-adm">
        {categorias.map((c) => (
          <li key={c.nombre} className={`cat-adm-it${c.activa ? '' : ' off'}`}>
            <span className="cat-adm-img" aria-hidden="true"><CategoriaCirculo nombre={c.nombre} src={c.imagen} claseImg="" /></span>
            <span className="cat-adm-n">
              {c.nombre}
              {!c.activa && <em className="cat-adm-b">De baja</em>}
            </span>
            <span className="cat-adm-acc">
              <button className="lnk" type="button" onClick={() => onEditar(c)}>Editar</button>
              {c.activa
                ? <button className="lnk" type="button" onClick={() => onBaja(c)}>Dar de baja</button>
                : <button className="lnk" type="button" onClick={() => onReactivar(c)}>Reactivar</button>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoriasActuales
