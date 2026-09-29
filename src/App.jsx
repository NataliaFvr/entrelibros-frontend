import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import ToastProvider from "./context/ToastContext"
import AuthProvider from "./context/AuthContext"
import LibrosProvider from "./context/LibrosContext"

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LibrosProvider>
            <AppRoutes />
          </LibrosProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
