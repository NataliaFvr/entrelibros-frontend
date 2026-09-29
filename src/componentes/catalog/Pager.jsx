export default function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <nav className="pager" aria-label="Paginación">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" className={p === page ? 'on' : undefined} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  )
}
