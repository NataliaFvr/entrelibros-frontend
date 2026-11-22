const CUENTA = [['perfil', 'Perfil'], ['marcapaginas', 'Marcapáginas'], ['compras', 'Historial de Compras'], ['direcciones', 'Direcciones']]

// Barra de pestañas. `pestanias` = [[clave, título]]; por defecto las de la cuenta.
const AccountTabs = ({ tab, onIr, pestanias = CUENTA }) => {
  return (
    <div className="atabs u-tabs">
      {pestanias.map(([clave, titulo]) => (
        <button key={clave} type="button" className={clave === tab ? 'on' : ''} onClick={() => onIr(clave)}>{titulo}</button>
      ))}
    </div>
  )
}

export default AccountTabs
