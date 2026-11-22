const AuthTabs = ({ tab, onCambiar }) => {
  return (
    <div className="atabs">
      <button type="button" className={tab === 'login' ? 'on' : ''} onClick={() => onCambiar('login')}>Ingresar</button>
      <button type="button" className={tab === 'register' ? 'on' : ''} onClick={() => onCambiar('register')}>Crear cuenta</button>
    </div>
  )
}

export default AuthTabs
