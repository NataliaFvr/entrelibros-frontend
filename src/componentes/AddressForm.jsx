/* oxlint-disable no-unused-vars */
import {mostrarToast} from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import {useDispatch,useSelector} from 'react-redux'
import { PROVINCIAS } from '../data/provincias'
import useFormulario from '../hooks/useFormulario'
import Field from './Field'
import SelectField from './SelectField'

const INICIAL = { alias: '', calle: '', ciudad: '', cp: '', provincia: PROVINCIAS[0] }

// Formulario a todo el ancho: los campos se acomodan en una grilla que se adapta al contenedor
// `embebido`: dentro de otra tarjeta (el resumen del carrito): sin tarjeta propia y en una sola columna.
// `onGuardada`: se llama cuando la dirección se guardó (con el back, cuando ya la aceptó).
const AddressForm = ({ embebido = false, onGuardada }) => {
  const dispatch=useDispatch()

  const agregarDireccion=async(d)=>{const r=await dispatch(crearDireccion(d));if(r.error){toast(r.error.message);return false}toast('Dirección guardada');return true}
  const toast=(msg,accion)=>dispatch(mostrarToast({msg,accion}))
  const f = useFormulario(INICIAL)
  const campo = (n) => ({ name: n, value: f.valores[n], onChange: f.cambiar, error: f.errores[n] })

  const enviar = async (e) => {
    e.preventDefault()
    const { alias, calle, ciudad, provincia, cp } = f.valores
    // Solo se limpia el formulario si se guardó: si el back falla, la persona conserva lo que escribió
    const guardada = await agregarDireccion({ alias: alias.trim(), calle: calle.trim(), ciudad: ciudad.trim(), prov: provincia, cp: cp.trim().toUpperCase() })
    if (guardada) { f.reiniciar(); if (onGuardada) onGuardada() }
  }

  return (
    <form className={`${embebido ? '' : 'card '}aform addr-form${embebido ? ' emb' : ''}`} noValidate onSubmit={enviar}>
      <h3 className="fr">Nueva dirección</h3>
      <Field label="Nombre (Casa, Trabajo…)" {...campo('alias')} />
      <Field label="Calle, número, piso y depto" autoComplete="street-address" {...campo('calle')} />
      <Field label="Ciudad / localidad" autoComplete="address-level2" {...campo('ciudad')} />
      <Field label="Código postal" autoComplete="postal-code" {...campo('cp')} />
      <SelectField label="Provincia" opciones={PROVINCIAS} {...campo('provincia')} />
      <button className="btn main" type="submit">Guardar dirección</button>
    </form>
  )
}

export default AddressForm
