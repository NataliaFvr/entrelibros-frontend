import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLibros } from '../hooks/useLibros'
import useFiltros from '../hooks/useFiltros'
import { PAGE_SIZE, filtrarLibros, masVendidos } from '../utils/filtrarLibros'
import { filtrosDesdeURL } from '../utils/filtrosURL'
import { plural } from '../utils/format'
import SortSelect from '../componentes/catalog/SortSelect'
import ActiveChips from '../componentes/catalog/ActiveChips'
import FilterSidebar from '../componentes/catalog/FilterSidebar'
import ProductGrid from '../componentes/catalog/ProductGrid'
import Pager from '../componentes/catalog/Pager'

function Catalogo({ inicial }) {
  const { libros, categorias } = useLibros()
  const { f, set, setPage, toggle, limpiar } = useFiltros(inicial)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const resultado = useMemo(() => filtrarLibros(libros, f), [libros, f])
  const topIds = useMemo(() => new Set(masVendidos(libros).slice(0, 6).map((l) => l.id)), [libros])

  const pages = Math.max(1, Math.ceil(resultado.length / PAGE_SIZE))
  const page = Math.min(f.page, pages)
  const items = resultado.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cambiarPagina = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <main className="cat">
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Libros</span></div>
      <div className="cat-top">
        <div>
          <h1>Libros</h1>
          <p>{resultado.length.toLocaleString('es-AR')} {plural(resultado.length, 'resultado', 'resultados')}</p>
        </div>
        <SortSelect value={f.sort} onChange={(sort) => set({ sort })} />
      </div>
      <ActiveChips f={f} set={set} toggle={toggle} onLimpiar={limpiar} />
      <button className="filters-btn" type="button" onClick={() => setFiltrosAbiertos((v) => !v)}>Filtros</button>
      <div className="cat-layout">
        <FilterSidebar f={f} set={set} toggle={toggle} libros={libros} categorias={categorias} abierto={filtrosAbiertos} />
        <div>
          <ProductGrid libros={items} topIds={topIds} ordenPorVentas={f.sort === 'best'} onLimpiar={limpiar} />
          <Pager page={page} pages={pages} onChange={cambiarPagina} />
        </div>
      </div>
    </main>
  )
}

// Al cambiar la URL (menú, buscador, "Ver todo") se reinician los filtros desde la nueva búsqueda
export default function CatalogPage() {
  const { search } = useLocation()
  const { categorias, cargando } = useLibros()
  if (cargando) return <main className="cat" />
  return <Catalogo key={search} inicial={filtrosDesdeURL(search, categorias)} />
}
