const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }

export const ChevronDown = () => (
  <svg {...base} strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
)

export const UserIcon = (props) => (
  <svg {...base} strokeWidth="1.8" {...props}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

// Estante con libros: dos repisas y libros apoyados encima (NO es el marcapáginas, que es de Favoritos)
export const SHELF_PATH = 'M3 10h18M3 20h18M5 10V5h3v5M10 10V4h3v6M15 10V6h4v4M5 20v-5h4v5M11 20v-7h3v7M16 20v-4h3v4'

export const ShelfIcon = () => (
  <svg {...base} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={SHELF_PATH} />
  </svg>
)

// Tres libros (dos parados y uno inclinado): reemplaza las tres rayas del menú hamburguesa
export const BooksMenuIcon = () => (
  <svg {...base} viewBox="0 0 32 26" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="6" width="6" height="17" rx="1.3" />
    <path d="M3 10h6" />
    <rect x="11" y="3" width="6" height="20" rx="1.3" />
    <path d="M11 7h6" />
    <rect x="19" y="7" width="6" height="16" rx="1.3" transform="rotate(14 19 23)" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base} viewBox="0 0 32 26" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M9 4l14 18M23 4L9 22" />
  </svg>
)
