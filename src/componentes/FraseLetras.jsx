import Letra from './Letra'

// Texto partido en palabras y letras, para el efecto de color al pasar el cursor
const FraseLetras = ({ texto, colores }) => {
  const palabras = texto.split(' ')
  return palabras.map((palabra, i) => (
    <span key={i}>
      <span className="word">{[...palabra].map((ch, j) => <Letra key={j} colores={colores}>{ch}</Letra>)}</span>
      {i < palabras.length - 1 && ' '}
    </span>
  ))
}

export default FraseLetras
