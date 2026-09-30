import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import ToastProvider from "./context/ToastContext"
import AuthProvider from "./context/AuthContext"
import LibrosProvider from "./context/LibrosContext"
import CompraProvider from "./context/CompraContext"

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LibrosProvider>
            <CompraProvider>
              <AppRoutes />
            </CompraProvider>
          </LibrosProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
