export default function CategoriasFilter({ categorias, value, onToggle }) {
  return (
    <div className="fbox">
      <h3>Categorías</h3>
      <div className="checks">
        {categorias.map((c) => (
          <label key={c} className="chk">
            <input type="checkbox" checked={value.includes(c)} onChange={() => onToggle(c)} />
            {c}
          </label>
        ))}
      </div>
    </div>
  )
}
