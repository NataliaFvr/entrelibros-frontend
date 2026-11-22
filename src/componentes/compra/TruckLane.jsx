const Rueda = ({ cx }) => {
  return (
    <g className="wh">
      <circle cx={cx} cy="100" r="13" fill="#042A2B" />
      <circle cx={cx} cy="100" r="5" fill="#FBFAF6" />
      <path d={`M${cx} 95v10`} stroke="#042A2B" strokeWidth="2" />
    </g>
  )
}

// Camión de libros que cruza la pantalla (decorativo; se frena con prefers-reduced-motion)
const TruckLane = () => {
  return (
    <div className="truck-lane" aria-hidden="true">
      <div className="truck">
        <svg viewBox="0 0 200 120">
          <rect x="16" y="16" width="16" height="24" rx="2" fill="#D84727" />
          <rect x="34" y="8" width="14" height="32" rx="2" fill="#042A2B" />
          <rect x="50" y="20" width="16" height="20" rx="2" fill="#EF7B45" />
          <rect x="68" y="12" width="14" height="28" rx="2" fill="#CDEDF6" stroke="#042A2B" strokeWidth="1.5" />
          <rect x="84" y="18" width="18" height="22" rx="2" fill="#D84727" />
          <rect x="104" y="10" width="14" height="30" rx="2" fill="#042A2B" />
          <rect x="8" y="40" width="124" height="50" rx="6" fill="#5EB1BF" />
          <path d="M60 50h22v28l-11-8-11 8z" fill="#FBFAF6" />
          <path d="M136 52h32l22 22v16h-54z" fill="#EF7B45" />
          <path d="M146 58h19l13 15h-32z" fill="#CDEDF6" />
          <circle cx="187" cy="82" r="3" fill="#FBFAF6" />
          <rect x="6" y="88" width="188" height="8" rx="3" fill="#042A2B" />
          <Rueda cx="36" />
          <Rueda cx="100" />
          <Rueda cx="168" />
        </svg>
      </div>
      <div className="road" />
    </div>
  )
}

export default TruckLane
