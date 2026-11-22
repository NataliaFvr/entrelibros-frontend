import Letra from './Letra'

// Texto partido en palabras y letras, para el efecto de color al pasar el cursor.
// No viene de la base (no hay id): la key es la palabra junto con dónde empieza en el texto, que es única y no cambia.
const FraseLetras = ({ texto, colores }) => {
  let inicio = 0
  const palabras = texto.split(' ').map((palabra) => {
    const parte = { id: `${palabra}@${inicio}`, palabra }
    inicio += palabra.length + 1
    return parte
  })
  return palabras.map(({ id, palabra }, i) => (
    <span key={id}>
      <span className="word">{[...palabra].map((ch, j) => <Letra key={`${id}-${j}`} colores={colores}>{ch}</Letra>)}</span>
      {i < palabras.length - 1 && ' '}
    </span>
  ))
}

export default FraseLetras
