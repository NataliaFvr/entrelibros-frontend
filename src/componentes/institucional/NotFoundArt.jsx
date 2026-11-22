// Ilustración del 404: "4 [libro abierto] 4" con hojas cayendo
const Hoja = ({ x, y, giro, demora }) => (
  <g className="m-fall" style={{ animationDelay: demora }}>
    <g transform={`translate(${x} ${y}) rotate(${giro})`}>
      <rect width="22" height="28" rx="2" fill="#FBFAF6" stroke="#042A2B" strokeWidth="2" />
      <path d="M5 8h12M5 14h12M5 20h8" stroke="#042A2B" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  </g>
)

const NotFoundArt = () => {
  return (
    <svg className="nf-art" viewBox="0 0 520 230" role="img" aria-label="Error 404">
      <text x="92" y="190" className="nf-n">4</text>
      <text x="428" y="190" className="nf-n">4</text>
      <g transform="translate(260 112)">
        <circle r="78" fill="none" stroke="#EF7B45" strokeWidth="26" />
        <path d="M-40 -24C-26 -32 -11 -30 0 -21C11 -30 26 -32 40 -24V28C26 20 11 22 0 31C-11 22 -26 20 -40 28Z" fill="#CDEDF6" stroke="#042A2B" strokeWidth="4" strokeLinejoin="round" />
        <path d="M0 -21V31" stroke="#042A2B" strokeWidth="4" />
        <path d="M-28 -10h17M-28 2h17M-28 14h12M11 -10h17M11 2h17M11 14h12" stroke="#5EB1BF" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 -66v46l9-7 9 7v-46z" fill="#D84727" />
      </g>
      <Hoja x={196} y={14} giro={-12} demora=".2s" />
      <Hoja x={316} y={8} giro={10} demora="1.3s" />
      <g className="m-fall" style={{ animationDelay: '2.4s' }}>
        <g transform="translate(262 0) rotate(-4)"><rect width="18" height="24" rx="2" fill="#5EB1BF" stroke="#042A2B" strokeWidth="2" /></g>
      </g>
    </svg>
  )
}

export default NotFoundArt
