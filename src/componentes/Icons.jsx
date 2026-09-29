const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }

export const ChevronDown = () => (
  <svg {...base} strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
)

export const UserIcon = (props) => (
  <svg {...base} strokeWidth="1.8" {...props}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

export const CartIcon = () => (
  <svg {...base} strokeWidth="1.8">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
  </svg>
)
