// Libro con patitas para el modal. `color` = tapa, `glyph` = path del ícono (viewBox 24)
const BookMascot = ({ color, glyph }) => {
  return (
    <svg viewBox="0 0 80 100" width="76" height="95" aria-hidden="true">
      <path d="M31 72L28 87L21 93M51 71L55 85L62 91" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13L63 7L68 70L16 77Z" fill={color} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <path d="M14 19L63 13" stroke="#FBFAF6" strokeWidth="2.5" strokeLinecap="round" />
      <g transform="translate(22 27) scale(1.5)" fill="none" stroke="#042A2B" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d={glyph} />
      </g>
    </svg>
  )
}

export default BookMascot
