import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// Una pregunta del acordeón. Está controlada desde afuera (`abierto` / `onAlternar`);
// se frena el comportamiento nativo de <details> para que mande el estado de React.
const FaqItem = ({ item, abierto, onAlternar }) => {
  return (
    <details open={abierto}>
      <summary onClick={(e) => { e.preventDefault(); onAlternar() }}>{item.q}</summary>
      <p>
        {item.a.map((parte) => (
          <Fragment key={typeof parte === 'string' ? parte : parte.to}>
            {typeof parte === 'string' ? parte : <Link to={parte.to}>{parte.label}</Link>}
          </Fragment>
        ))}
      </p>
    </details>
  )
}

export default FaqItem
