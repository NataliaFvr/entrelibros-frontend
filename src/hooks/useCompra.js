/* oxlint-disable no-unused-vars */
import { mostrarToast } from '../redux/toastSlice'
import { abrirGate,cerrarGate as cerrarGateAction,cancelarVerificacion,confirmarEmail,crearDireccion,eliminarDireccion as eliminarDireccionThunk,fetchUsuario,guardarPerfil,limpiarPendiente as limpiarPendienteAction,login as loginThunk,logout as logoutThunk,marcarPrincipal as marcarPrincipalThunk,NOTA_SIN_CONFIRMAR,quitarMarks as quitarMarksThunk,reenviarCodigo,registrar as registrarThunk,toggleMark as toggleMarkThunk } from '../redux/userSlice'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { agregarAlCarrito, cambiarCantidad, fetchCarrito, quitarDelCarrito } from '../redux/carritoSlice'
import { cancelarPedido, crearPedido, fetchPedidos, pagarPedido } from '../redux/pedidosSlice'

// Las acciones del carrito se hacen de a una, en orden: si alguien toca "Añadir" dos veces seguidas, la segunda ya ve el ítem
// creado por la primera y lo modifica (POST /carrito/items crearía una fila repetida).
let cola = Promise.resolve()

// Carrito y pedidos de la cuenta con sesión (Redux/carritoSlice.js y Redux/pedidosSlice.js).
// `agregar`, `cambiarCantidad` y `quitar` devuelven una promesa con true si se aplicó.
export const useCompra = () => {
  const dispatch = useReduxDispatch()
  const toast = (msg, accion) => dispatch(mostrarToast({ msg, accion }))
  const { user, marks } = useReduxSelector((s) => s.user)
  const quitarMarks = (ids) => {
    const q = ids.filter((i) => marks.includes(i))
    if (q.length) dispatch(quitarMarksThunk(q))
  }
  const carrito = useReduxSelector((state) => state.carrito.items)
  const pedidos = useReduxSelector((state) => state.pedidos.items)
  const idUsuario = user && user.rol !== 'ADMIN' ? user.id : null // el admin no compra

  const ejecutar = (accion, alTerminar) => {
    const turno = cola.then(async () => {
      const resultado = await dispatch(accion)
      if (resultado.error) {
        toast(resultado.error.message)
        await dispatch(fetchCarrito(idUsuario)) // se trae cómo quedó el carrito en el back
        return false
      }
      if (alTerminar) alTerminar()
      return true
    })
    cola = turno
    return turno
  }

  const agregar = (libro, cantidad = 1) => {
    // Ya están todas las unidades que el back permite (maxCantidad): no se manda un pedido que va a rechazar
    const enCarrito = carrito.find((c) => c.id === libro.id)
    if (enCarrito && enCarrito.q >= enCarrito.maxCantidad) {
      toast('Ya tenés en tu estantería todas las unidades disponibles', { texto: 'Ir a mi estantería', a: '/carrito' })
      return Promise.resolve(true)
    }
    return ejecutar(agregarAlCarrito({ libro, cantidad }), () => toast('Añadido a tu estantería', { texto: 'Ir a mi estantería', a: '/carrito' }))
  }
  const cambiarCantidadLibro = (libro, delta) => ejecutar(cambiarCantidad({ libro, delta }))
  const quitar = (id) => ejecutar(quitarDelCarrito(id))

  // Convierte el carrito en un pedido pendiente de pago y devuelve su número
  const crear = async (direccion) => {
    const resultado = await dispatch(crearPedido(direccion))
    if (resultado.error) throw new Error(resultado.error.message)
    // El back ya vació el carrito al crear la orden: carritoSlice lo vacía con la misma acción, sin volver a pedirlo
    toast('Reservamos tus libros por 1 hora')
    return resultado.payload.n
  }

  // Devuelve el resultado del pago. Al aprobarse, los libros dejan de ser un deseo: se sacan del Marcapáginas
  const pagar = async (n, proveedor) => {
    const pedido = pedidos.find((o) => o.n === n)
    const resultado = await dispatch(pagarPedido({ n, proveedor }))
    if (resultado.error) {
      await dispatch(fetchPedidos(idUsuario)) // por ejemplo, la reserva venció mientras se pagaba: la orden pudo cambiar
      throw new Error(resultado.error.message)
    }
    if (resultado.payload.resultado === 'SIMULADO_APROBADO' && pedido) quitarMarks(pedido.its.map((i) => i.id))
    return resultado.payload.resultado
  }

  const cancelar = async (n) => {
    const resultado = await dispatch(cancelarPedido(n))
    if (resultado.error) {
      toast(resultado.error.message)
      await dispatch(fetchPedidos(idUsuario)) // por ejemplo, ya estaba pagada o vencida: se trae cómo quedó
      return
    }
    toast('Compra cancelada. Liberamos tus libros.')
  }

  return {
    carrito, pedidos, cartCount: carrito.reduce((n, c) => n + c.q, 0),
    agregar, cambiarCantidad: cambiarCantidadLibro, quitar, crearPedido: crear, pagarPedido: pagar, cancelarPedido: cancelar,
  }
}