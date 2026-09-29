import ProductCard from './ProductCard'

const SavedBook = ({ libro, onAlCarrito, onQuitar }) => {
  return (
    <div className="ucard">
      <ProductCard libro={libro} />
      <div className="pact">
        <button className="btn alt" type="button" onClick={onAlCarrito}>Agregar al carrito</button>
        <button className="lnk" type="button" onClick={onQuitar}>Quitar</button>
      </div>
    </div>
  )
}

export default SavedBook
