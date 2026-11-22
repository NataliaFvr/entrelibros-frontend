import { useSelector } from 'react-redux'
import { selectCatalogo } from '../redux/selectores'
import { useMemo } from 'react'
import { useLibros } from '../hooks/useLibros'
import { masVendidos, ordenarPorVentas } from '../utils/filtrarLibros'
import { categoriasDe, esUsado } from '../utils/libro'
import Hero from '../componentes/institucional/Hero'
import SeccionLibros from '../componentes/catalogo/SeccionLibros'
import FlashSale from '../componentes/institucional/FlashSale'
import Tagline from '../componentes/comun/Tagline'
import CategoryGrid from '../componentes/catalogo/CategoryGrid'
import AuthorGrid from '../componentes/libro/AuthorGrid'
import ProximaAventura from '../componentes/institucional/ProximaAventura'

const HomePage = () => {
  const catalogo = useSelector(selectCatalogo)
  const { libros, categorias } = useLibros(catalogo)

  const { best, nuevos, usados, conDesc, topDesc, autores, topCategorias } = useMemo(() => {
    const best = masVendidos(libros) // solo nuevos: los usados no son bestsellers
    const ordenados = ordenarPorVentas(libros)
    const usados = ordenados.filter(esUsado)
    const nuevos = libros.filter((l) => !esUsado(l)).sort((a, b) => b.id - a.id) // los recién publicados primero
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
    return { best, nuevos, usados, conDesc, topDesc, autores, topCategorias }
  }, [libros, categorias])

  return (
    <div className="home-page">
      <Hero libros={best} />
      <SeccionLibros titulo="Libros Nuevos" to="/libros?estado=nuevos&sort=new" libros={nuevos} />
      <SeccionLibros titulo="Libros que buscan una nueva estantería" to="/libros?estado=usados" libros={usados} />
      <ProximaAventura libros={libros} categorias={categorias} />
      <SeccionLibros titulo="Bestsellers" to="/libros?sort=best" libros={best} />
      <SeccionLibros titulo="En Oferta" to="/libros?desc=1" libros={conDesc} />
      <FlashSale libros={topDesc} />
      <CategoryGrid categorias={topCategorias} />
      <Tagline />
      <AuthorGrid autores={autores} />
    </div>
  )
}

export default HomePage