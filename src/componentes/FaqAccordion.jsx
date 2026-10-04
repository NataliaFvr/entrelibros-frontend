import useAcordeon from '../hooks/useAcordeon'
import FaqItem from './FaqItem'

// Preguntas agrupadas por categoría; una sola abierta a la vez. Al entrar están todas cerradas (+).
const FaqAccordion = ({ categorias }) => {
  const { abierto, alternar } = useAcordeon()

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
