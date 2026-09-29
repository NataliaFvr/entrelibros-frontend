import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UserHead from '../componentes/UserHead'
import AccountTabs from '../componentes/AccountTabs'
import ProfileCard from '../componentes/ProfileCard'
import EditProfileForm from '../componentes/EditProfileForm'
import ComingSoon from '../componentes/ComingSoon'

const PROXIMAS = { marcapaginas: 'Marcapáginas', compras: 'Historial de Compras', direcciones: 'Direcciones' }

// /cuenta = perfil · /cuenta/editar = editar perfil · las demás pestañas llegan en la próxima etapa
const AccountPage = () => {
  const { user, perfil, logout, actualizarPerfil } = useAuth()
  const { tab = 'perfil' } = useParams()
  const navigate = useNavigate()
  const [saliendo, setSaliendo] = useState(false)

  const salir = () => {
    setSaliendo(true) // evita que, sin usuario, lo mande a /ingresar en vez de al inicio
    logout()
    navigate('/')
  }
  const guardar = (valores, nuevoPerfil) => {
    actualizarPerfil(valores, nuevoPerfil)
    navigate('/cuenta')
  }

  if (!user) return saliendo ? null : <Navigate to="/ingresar" replace state={{ from: '/cuenta' }} />
  if (tab !== 'perfil' && tab !== 'editar' && !PROXIMAS[tab]) return <Navigate to="/cuenta" replace />

  const pestania = tab === 'editar' ? 'perfil' : tab
  const irA = (t) => navigate(t === 'perfil' ? '/cuenta' : `/cuenta/${t}`)

  return (
    <main className="usr">
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Mi Entrelibros</span></div>
      <UserHead user={user} perfil={perfil} onLogout={salir} />
      <AccountTabs tab={pestania} onIr={irA} />
      {tab === 'perfil' && <ProfileCard user={user} onEditar={() => navigate('/cuenta/editar')} />}
      {tab === 'editar' && <EditProfileForm user={user} perfil={perfil} onGuardar={guardar} onCancelar={() => navigate('/cuenta')} />}
      {PROXIMAS[tab] && <ComingSoon titulo={PROXIMAS[tab]} />}
    </main>
  )
}

export default AccountPage
