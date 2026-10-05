// Lista de categorías del catálogo, en etiquetas.
const CategoriasActuales = ({ categorias }) => {
  return (
    <div className="card">
      <h3 className="fr adm-card-t">Categorías actuales ({categorias.length})</h3>
      <ul className="adm-chips">
        {categorias.map((c) => <li className="adm-chip" key={c}>{c}</li>)}
      </ul>
    </div>
  )
}

export default CategoriasActuales
