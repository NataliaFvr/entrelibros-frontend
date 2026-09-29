import BookMascot from './BookMascot'

const GateColumn = ({ color, glyph, negrita, resto }) => {
  return (
    <div>
      <BookMascot color={color} glyph={glyph} />
      <p><b>{negrita}</b> {resto}</p>
    </div>
  )
}

export default GateColumn
