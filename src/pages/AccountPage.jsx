import { mostrarToast } from '../redux/toastSlice'
import {urlFotoUsuario} from '../api/usuariosApi'
import { fetchUsuario,guardarPerfil,logout as logoutThunk } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import UserHead from '../componentes/UserHead'
import AccountTabs from '../componentes/AccountTabs'
import ProfileCard from '../componentes/ProfileCard'
import EditProfileForm from '../componentes/EditProfileForm'
import SavedBooks from '../componentes/SavedBooks'
import AddressPanel from '../componentes/AddressPanel'
import OrdersPanel from '../componentes/OrdersPanel'

const PESTANIAS = ['perfil', 'editar', 'marcapaginas', 'compras', 'direcciones']

// /cuenta = perfil · /cuenta/editar · /cuenta/marcapaginas · /cuenta/compras · /cuenta/direcciones
const AccountPage = () => {
  const dispatch=useDispatch()
  const {user}=useSelector(s=>s.user)

  const perfil=user?{avatar:user.avatar||'',foto:user.tieneFoto?urlFotoUsuario(user.id):''}:{}
  const logout=()=>dispatch(logoutThunk())
  const actualizarPerfil=async(v,n)=>{const r=await dispatch(guardarPerfil({valores:v,nuevoPerfil:n,user}));if(r.error){dispatch(fetchUsuario(user.id));throw Error(r.error.message)}return r.payload.sesionCerrada?{sesionCerrada:true}:{}}
  const { tab = 'perfil' } = useParams()
  const navigate = useNavigate()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const [saliendo, setSaliendo] = useState(false)

  const salir = () => {
    setSaliendo(true) // evita que, sin usuario, lo mande a /ingresar en vez de al inicio
    logout()
    navigate('/')
  }
  const guardar = async (valores, nuevoPerfil) => {
    try {
      const r = await actualizarPerfil(valores, nuevoPerfil)
      if (r && r.sesionCerrada) navigate('/ingresar') // cambió el e-mail: hay que volver a ingresar
      else navigate('/cuenta')
    } catch (err) {
      toast(err.message) // con el back: duplicado, validación, etc.
    }
  }

  if (!user) return saliendo ? null : <Navigate to="/ingresar" replace state={{ from: '/cuenta' }} />
  if (!PESTANIAS.includes(tab)) return <Navigate to="/cuenta" replace />

  const pestania = tab === 'editar' ? 'perfil' : tab
  const irA = (t) => navigate(t === 'perfil' ? '/cuenta' : `/cuenta/${t}`)

  return (
    <main className="usr">
      <div className="crumbs"><Link to="/">Inicio</Link> › <span>Mi Entrelibros</span></div>
      <UserHead user={user} perfil={perfil} onLogout={salir} />
      <AccountTabs tab={pestania} onIr={irA} />
      {tab === 'perfil' && <ProfileCard user={user} onEditar={() => navigate('/cuenta/editar')} />}
      {tab === 'editar' && <EditProfileForm user={user} perfil={perfil} onGuardar={guardar} onCancelar={() => navigate('/cuenta')} />}
      {tab === 'marcapaginas' && <SavedBooks />}
      {tab === 'direcciones' && <AddressPanel />}
      {tab === 'compras' && <OrdersPanel />}
    </main>
  )
}

export default AccountPage
