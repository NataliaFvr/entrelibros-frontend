const DescriptionSection = ({ libro }) => {
  return (
    <section className="dsec">
      <h2>Descripción</h2>
      <div className="card">
        <p>{libro.t}, de {libro.a}, en edición {libro.usado ? 'usada' : 'nueva'} de {libro.ed} ({libro.anio}), en {libro.idioma.toLowerCase()}.</p>
        <p>Pertenece a la categoría {libro.cat}. Lo vende {libro.v}.</p>
      </div>
    </section>
  )
}

export default DescriptionSection
