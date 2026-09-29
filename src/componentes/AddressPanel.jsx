import AddressList from './AddressList'
import AddressForm from './AddressForm'

// Pestaña Direcciones: lista a la izquierda, formulario a la derecha
const AddressPanel = () => {
  return (
    <div className="addr-wrap">
      <AddressList />
      <AddressForm />
    </div>
  )
}

export default AddressPanel
