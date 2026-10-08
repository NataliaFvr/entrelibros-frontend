import { useMemo } from 'react'
import { useLibros } from '../hooks/useLibros'
import { masVendidos, ordenarPorVentas } from '../utils/filtrarLibros'
import { categoriasDe, esUsado } from '../utils/libro'
import Hero from '../componentes/Hero'
import SeccionLibros from '../componentes/SeccionLibros'
import FlashSale from '../componentes/FlashSale'
import Tagline from '../componentes/Tagline'
import CategoryGrid from '../componentes/CategoryGrid'
import MiniDeco from '../componentes/MiniDeco'
import AuthorGrid from '../componentes/AuthorGrid'

const HomePage = () => {
  const { libros, categorias } = useLibros()

  const { best, usados, conDesc, topDesc, autores, topCategorias } = useMemo(() => {
    const best = masVendidos(libros) // solo nuevos: los usados no son bestsellers
    const ordenados = ordenarPorVentas(libros)
    const usados = ordenados.filter(esUsado)
    const conDesc = ordenados.filter((l) => l.d > 0)
    const topDesc = [...conDesc].sort((a, b) => b.d - a.d)
    const porMasLibros = (a, b) => b.cantidad - a.cantidad
    const cuentaAutores = new Map()
    const cuentaCats = new Map(categorias.map((c) => [c, 0]))
    libros.forEach((l) => {
      cuentaAutores.set(l.a, (cuentaAutores.get(l.a) || 0) + 1)
      categoriasDe(l).forEach((c) => { if (cuentaCats.has(c)) cuentaCats.set(c, cuentaCats.get(c) + 1) })
    })
    const autores = [...cuentaAutores].map(([nombre, cantidad]) => ({ nombre, cantidad })).sort(porMasLibros)
    const topCategorias = [...cuentaCats].map(([nombre, cantidad]) => ({ nombre, cantidad })).sort(porMasLibros).map((c) => c.nombre)
    return { best, usados, conDesc, topDesc, autores, topCategorias }
  }, [libros, categorias])

  return (
    <>
      <Hero libros={best} />
      <SeccionLibros titulo="Bestsellers" to="/libros?sort=best" libros={best} />
      <SeccionLibros titulo="En Oferta" to="/libros?desc=1" libros={conDesc} />
      <FlashSale libros={topDesc} />
      <SeccionLibros titulo="Libros Nuevos" to="/libros?estado=nuevos" libros={best} />
      <SeccionLibros titulo="Libros Usados" to="/libros?estado=usados" libros={usados} />
      <Tagline />
      <CategoryGrid categorias={topCategorias} />
      <MiniDeco />
      <AuthorGrid autores={autores} />
    </>
  )
}

export default HomePage
