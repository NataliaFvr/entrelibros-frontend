import FraseLetras from './FraseLetras'

// Cabecera de cada pantalla del panel: migas, título (con el efecto de letras), subtítulo y, a la derecha, una acción opcional.
const AdminHead = ({ seccion, titulo, sub, children }) => {
  return (
    <>
      <div className="crumbs">Administración › {seccion}</div>
      <div className="adm-top">
        <div>
          <h1><FraseLetras texto={titulo} /></h1>
          {sub && <p>{sub}</p>}
        </div>
        {children}
      </div>
    </>
  )
}

export default AdminHead
