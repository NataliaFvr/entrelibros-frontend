import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { store } from "./redux/store.js"

ReactDOM.createRoot(document.getElementById("root")).render(
  // Sin <React.StrictMode>: en desarrollo monta cada componente dos veces y duplica todos los pedidos al back
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)