import { Routes, Route } from "react-router-dom"
import Layout from "../componentes/Layout"
import HomePage from "../pages/HomePage"
import CatalogPage from "../pages/CatalogPage"
import BookDetailPage from "../pages/BookDetailPage"
import AuthPage from "../pages/AuthPage"
import AccountPage from "../pages/AccountPage"
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<CatalogPage />} />
        <Route path="/libro/:id" element={<BookDetailPage />} />
        <Route path="/ingresar" element={<AuthPage tab="login" />} />
        <Route path="/registrarse" element={<AuthPage tab="register" />} />
        <Route path="/cuenta" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
