// Ilustración de "Sobre nosotros": pila de libros con una taza de café humeante encima
const AboutArt = () => {
  return (
    <svg className="mascot" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#CDEDF6" />
      <g transform="translate(40 62)">
        <rect x="0" y="98" width="114" height="15" rx="3" fill="#D84727" />
        <rect x="6" y="80" width="102" height="17" rx="3" fill="#5EB1BF" transform="rotate(-1.5 57 88)" />
        <rect x="2" y="61" width="106" height="18" rx="3" fill="#042A2B" transform="rotate(1.5 55 70)" />
        <rect x="8" y="41" width="98" height="19" rx="3" fill="#5EB1BF" transform="rotate(-1.5 57 50)" />
        <rect x="4" y="20" width="104" height="20" rx="3" fill="#EF7B45" transform="rotate(1.5 56 30)" />
        <path d="M70 20v20l8-6 8 6V20" fill="#FBFAF6" />
        <g transform="translate(52 -35)">
          <path d="M2 22C2 10 12 2 26 2C40 2 50 10 50 22V44C50 52 40 56 26 56C12 56 2 52 2 44Z" fill="#042A2B" />
          <ellipse cx="26" cy="22" rx="24" ry="7" fill="#0A3B3C" />
          <path d="M50 20h8c7 0 11 5 11 11s-4 11-11 11h-6" fill="none" stroke="#042A2B" strokeWidth="5" />
          <g className="m-steam">
            <path d="M14 -4C11 -10 17 -13 14 -19" fill="none" stroke="#042A2B" strokeWidth="2.6" strokeLinecap="round" opacity=".8" />
            <path d="M27 -4C24 -10 30 -13 27 -19" fill="none" stroke="#042A2B" strokeWidth="2.6" strokeLinecap="round" opacity=".8" />
            <path d="M40 -4C37 -10 43 -13 40 -19" fill="none" stroke="#042A2B" strokeWidth="2.6" strokeLinecap="round" opacity=".8" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default AboutArt
