import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// Migas de pan: siempre arranca en "Inicio". `items` = [{ label, to? }]; el último va sin `to`.
const Migas = ({ items = [] }) => {
  return (
    <div className="crumbs">
      <Link to="/">Inicio</Link>
      {items.map((m) => (
        <Fragment key={m.label}>
          {' › '}
          {m.to ? <Link to={m.to}>{m.label}</Link> : <span>{m.label}</span>}
        </Fragment>
      ))}
    </div>
  )
}

export default Migas
