import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UserHead from '../componentes/UserHead'
import ProfileCard from '../componentes/ProfileCard'

// TODO: pestañas Marcapáginas, Historial de compras y Direcciones
const AccountPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [saliendo, setSaliendo] = useState(false)

  const salir = () => {
    setSaliendo(true) // evita que, sin usuario, lo mande a /ingresar en vez de al inicio
    logout()
    navigate('/')
  }

  if (!user) return saliendo ? null : <Navigate to="/ingresar" replace state={{ from: '/cuenta' }} />

  return (
    <main className="usr">
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Mi Entrelibros</span></div>
      <UserHead user={user} onLogout={salir} />
      <ProfileCard user={user} />
    </main>
  )
}

export default AccountPage
