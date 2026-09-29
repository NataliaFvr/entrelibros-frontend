const SpecSection = ({ libro }) => {
  const spec = [
    ['Título', libro.t], ['Autor', libro.a], ['Editorial', libro.ed], ['Idioma', libro.idioma],
    ['Año de edición', libro.anio], ['Categoría', libro.cat], ['Estado', libro.usado ? 'Usado' : 'Nuevo'], ['Vendedor', libro.v],
  ]
  return (
    <section className="dsec" id="spec">
      <h2>Características</h2>
      <div className="card spec">
        {spec.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
      </div>
    </section>
  )
}

export default SpecSection
