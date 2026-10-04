import useAcordeon from '../hooks/useAcordeon'
import FaqItem from './FaqItem'

// Preguntas agrupadas por categoría; una sola abierta a la vez (arranca la primera).
const FaqAccordion = ({ categorias }) => {
  const { abierto, alternar } = useAcordeon(categorias[0]?.items[0]?.id ?? null)

  return categorias.map((cat) => (
    <section key={cat.titulo}>
      <h2 className="faq-cat">{cat.titulo}</h2>
      {cat.items.map((item) => (
        <FaqItem key={item.id} item={item} abierto={abierto === item.id} onAlternar={() => alternar(item.id)} />
      ))}
    </section>
  ))
}

export default FaqAccordion
