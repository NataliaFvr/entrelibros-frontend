import { useState } from 'react'
import { PROVINCIAS } from '../data/provincias'

const OPCIONES = [['misma', 'Misma provincia'], ['distinta', 'Provincia distinta']]

// Filtro por provincia del envío. Con una dirección cargada usa la principal. Si no hay (sin sesión o sin direcciones),
// al activar un interruptor pide la provincia ahí mismo, como el código postal de Mercado Libre: no hace falta cuenta.
// `provincia`: la que se usa para filtrar · `desdeDireccion`: true si sale de la dirección principal · `onProvincia(p)`: eligió una
const EnvioFilter = ({ value, onToggle, provincia, desdeDireccion, onProvincia }) => {
  const [esperando, setEsperando] = useState(null) // interruptor que se tocó y espera que elija la provincia

  const tocar = (v) => {
    if (provincia) onToggle(v)
    else setEsperando(esperando === v ? null : v)
  }

  const elegir = (p) => {
    onProvincia(p)
    if (p && esperando) {
      onToggle(esperando)
      setEsperando(null)
    }
  }

  // También si el filtro vino activado en el link y todavía no hay provincia
  const mostrarSelector = !desdeDireccion && (esperando || provincia || value.length > 0)

  return (
    <div className="fbox">
      <h3>Envíos</h3>
      {OPCIONES.map(([v, etiqueta]) => (
        <label key={v} className="tgl">
          {etiqueta}
          <input type="checkbox" checked={value.includes(v) || esperando === v} onChange={() => tocar(v)} />
          <span className="sw" />
        </label>
      ))}
      {mostrarSelector && (
        <label className="fld envio-prov">
          {provincia ? 'Comprás desde' : '¿Desde qué provincia comprás?'}
          <select className="fsel" id="envio-provincia" value={provincia || ''} onChange={(e) => elegir(e.target.value)}>
            <option value="" disabled>Elegí tu provincia</option>
            {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      )}
      {desdeDireccion && provincia && <small className="dim">Según tu dirección principal ({provincia}).</small>}
    </div>
  )
}

export default EnvioFilter
