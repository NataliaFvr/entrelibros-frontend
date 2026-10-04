import Migas from './Migas'
import AuthHero from './AuthHero'
import MiniDeco from './MiniDeco'

// Estructura común de las páginas informativas: migas + cabecera + contenido + decoración.
// `pie` = algo que va después de la decoración (ej. el camión de envíos).
const InfoLayout = ({ titulo, sub, migas, pie, children }) => {
  return (
    <main className="usr">
      <Migas items={migas} />
      <AuthHero titulo={titulo} sub={sub} />
      {children}
      <MiniDeco />
      {pie}
    </main>
  )
}

export default InfoLayout
