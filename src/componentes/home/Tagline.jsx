import Letra from './Letra'
import { DecoDerecha, DecoIzquierda } from './TagDeco'

const FRASE = 'Cada libro es una puerta a otro mundo'

export default function Tagline() {
  return (
    <div className="tag-wrap">
      <DecoIzquierda />
      <p className="tagline">
        {FRASE.split(' ').map((palabra, i, arr) => (
          <span key={i}>
            <span className="word">{[...palabra].map((ch, j) => <Letra key={j}>{ch}</Letra>)}</span>
            {i < arr.length - 1 && ' '}
          </span>
        ))}
      </p>
      <DecoDerecha />
    </div>
  )
}
