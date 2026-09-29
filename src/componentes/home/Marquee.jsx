// Cinta que se desplaza sola; el contenido se duplica para que el loop no tenga saltos
export default function Marquee({ children }) {
  return (
    <div className="marquee">
      <div className="marquee-track">{children}{children}</div>
    </div>
  )
}
