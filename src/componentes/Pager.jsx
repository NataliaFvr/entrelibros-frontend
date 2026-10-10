const Pager = ({ page, pages, onChange }) => {
  if (pages <= 1) return null
  const visibles = [...new Set([1, pages, ...Array.from({ length: 5 }, (_, i) => page - 2 + i).filter((p) => p > 1 && p < pages)])].sort((a, b) => a - b)
  return (
    <nav className="pager" aria-label="Paginación">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {visibles.map((p, i) => <span key={p}>{i > 0 && p - visibles[i - 1] > 1 && <span aria-hidden="true">…</span>}<button type="button" className={p === page ? 'on' : undefined} onClick={() => onChange(p)}>{p}</button></span>)}
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  )
}

export default Pager
