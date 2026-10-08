import { categoriasDe, textoCategorias } from '../utils/libro'
const SpecSection = ({ libro }) => {
  const spec = [
    ['Título', libro.t], ['Autor', libro.a], ['Editorial', libro.ed], ['Idioma', libro.idioma],
    ['Año de edición', libro.anio], [categoriasDe(libro).length > 1 ? 'Categorías' : 'Categoría', textoCategorias(libro)], ['Estado', libro.usado ? 'Usado' : 'Nuevo'], ['Vendedor', libro.v],
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
