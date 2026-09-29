const PESTANIAS = [['perfil', 'Perfil'], ['marcapaginas', 'Marcapáginas'], ['compras', 'Historial de Compras'], ['direcciones', 'Direcciones']]

const AccountTabs = ({ tab, onIr }) => {
  return (
    <div className="atabs u-tabs">
      {PESTANIAS.map(([clave, titulo]) => (
        <button key={clave} type="button" className={clave === tab ? 'on' : ''} onClick={() => onIr(clave)}>{titulo}</button>
      ))}
    </div>
  )
}

export default AccountTabs
