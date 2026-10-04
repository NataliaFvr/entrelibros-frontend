// Ilustración de la página de contacto: sobres que caen sobre una carta
const ContactArt = () => {
  return (
    <svg className="mascot" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#CDEDF6" />
      <g className="m-fall" style={{ animationDelay: '.4s' }}>
        <g transform="translate(140 24) rotate(14)">
          <rect x="0" y="0" width="34" height="24" rx="2" fill="#FBFAF6" stroke="#042A2B" strokeWidth="2" />
          <path d="M0 2l17 13L34 2" fill="none" stroke="#042A2B" strokeWidth="2" />
        </g>
      </g>
      <g className="m-fall" style={{ animationDelay: '1s' }}>
        <g transform="translate(30 16) rotate(-10)">
          <rect x="0" y="0" width="24" height="17" rx="2" fill="#FBFAF6" stroke="#042A2B" strokeWidth="2" />
          <path d="M0 2l12 9L24 2" fill="none" stroke="#042A2B" strokeWidth="2" />
        </g>
      </g>
      <g transform="translate(46 88) rotate(-6)">
        <rect x="0" y="18" width="108" height="76" rx="6" fill="#FBFAF6" stroke="#042A2B" strokeWidth="3" />
        <path d="M0 20l54 40 54-40" fill="none" stroke="#042A2B" strokeWidth="3" strokeLinejoin="round" />
        <rect x="30" y="0" width="52" height="70" rx="3" fill="#EF7B45" transform="rotate(-4 56 35)" />
        <path d="M40 20h32M40 30h26M40 40h30" stroke="#FBFAF6" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-4 56 35)" />
      </g>
      <circle cx="150" cy="140" r="16" fill="#5EB1BF" />
      <path d="M144 140l4 5 9-10" fill="none" stroke="#FBFAF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ContactArt
