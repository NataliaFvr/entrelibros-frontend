import ProductCard from './ProductCard'

const SavedBook = ({ libro, onAlCarrito, onQuitar }) => {
  return (
    <div className="ucard">
      <ProductCard libro={libro} />
      <div className="pact">
        <button className="btn alt" type="button" onClick={onAlCarrito}>Añadir a mi estantería</button>
        <button className="lnk" type="button" onClick={onQuitar}>Quitar</button>
      </div>
    </div>
  )
}

export default SavedBook
