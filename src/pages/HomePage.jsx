import { useMemo } from 'react'
import { useLibros } from '../hooks/useLibros'
import { masVendidos } from '../utils/filtrarLibros'
import Hero from '../componentes/Hero'
import SeccionLibros from '../componentes/SeccionLibros'
import FlashSale from '../componentes/FlashSale'
import Tagline from '../componentes/Tagline'
import CategoryMarquee from '../componentes/CategoryMarquee'
import MiniDeco from '../componentes/MiniDeco'
import AuthorMarquee from '../componentes/AuthorMarquee'

const HomePage = () => {
  const { libros, categorias } = useLibros()

  const { best, conDesc, topDesc, autores } = useMemo(() => {
    const best = masVendidos(libros)
    const conDesc = best.filter((l) => l.d > 0)
    const topDesc = [...conDesc].sort((a, b) => b.d - a.d)
    const cuenta = new Map()
    libros.forEach((l) => cuenta.set(l.a, (cuenta.get(l.a) || 0) + 1))
    const autores = [...cuenta].slice(0, 8).map(([nombre, cantidad]) => ({ nombre, cantidad }))
    return { best, conDesc, topDesc, autores }
  }, [libros])

  return (
    <>
      <Hero libros={best} />
      <SeccionLibros titulo="Bestsellers" to="/libros?sort=best" libros={best} />
      <SeccionLibros titulo="En Oferta" to="/libros?desc=1" libros={conDesc} />
      <FlashSale libros={topDesc} />
      <SeccionLibros titulo="Libros Nuevos" to="/libros?estado=nuevos" libros={best.filter((l) => !l.usado)} />
      <SeccionLibros titulo="Libros Usados" to="/libros?estado=usados" libros={best.filter((l) => l.usado)} />
      <Tagline />
      <CategoryMarquee categorias={categorias} />
      <MiniDeco />
      <AuthorMarquee autores={autores} />
    </>
  )
}

export default HomePage
