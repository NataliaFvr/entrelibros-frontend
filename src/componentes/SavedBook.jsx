import ProductCard from './ProductCard'

// `propio`: es una publicación de quien mira -> no se puede añadir a la estantería
const SavedBook = ({ libro, onAlCarrito, onQuitar, propio = false }) => {
  return (
    <div className="ucard">
      <ProductCard libro={libro} propio={propio} />
      <div className="pact">
        {!propio && <button className="btn alt" type="button" onClick={onAlCarrito}>Añadir a mi estantería</button>}
        <button className="lnk" type="button" onClick={onQuitar}>Quitar</button>
      </div>
    </div>
  )
}

export default SavedBook
