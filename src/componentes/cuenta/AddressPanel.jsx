import AddressList from './AddressList'
import AddressForm from './AddressForm'

// Pestaña Direcciones: ocupa todo el ancho; primero las tarjetas y debajo el formulario
const AddressPanel = () => {
  return (
    <div className="addr-wrap">
      <AddressList />
      <AddressForm />
    </div>
  )
}

export default AddressPanel
