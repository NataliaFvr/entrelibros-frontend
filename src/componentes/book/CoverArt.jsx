import { textOn } from '../../utils/colors'

// Una "vista" del libro: 0 portada, 1 contraportada, 2 lomo. Si hay fotos reales, muestra la foto k.
export default function CoverArt({ libro, k }) {
  if (libro.imgs && libro.imgs.length) {
    return <img src={libro.imgs[k] || libro.imgs[0]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  }
  const st = { background: libro.c, color: textOn(libro.c) }

  if (k === 1) {
    return (
      <div className="gimg back" style={st}>
        <span>{libro.t}</span>
        <span><i className="ln" /><i className="ln" /><i className="ln" style={{ width: '70%' }} /></span>
        <span className="bc" />
      </div>
    )
  }
  if (k === 2) {
    return <div className="gimg spn"><div className="sp" style={st}>{libro.t}</div></div>
  }
  return (
    <div className="gimg" style={st}>
      <span className="ga">{libro.a}</span>
      {libro.t}
    </div>
  )
}
