export default function Stars({ value }) {
  return <span className="stars" style={{ '--p': `${(value / 5) * 100}%` }}>★★★★★</span>
}
