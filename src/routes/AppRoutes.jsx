import { Routes, Route } from "react-router-dom"
import Layout from "../componentes/Layout"
import HomePage from "../pages/HomePage"
import CatalogPage from "../pages/CatalogPage"
import BookDetailPage from "../pages/BookDetailPage"
import AuthPage from "../pages/AuthPage"
import AccountPage from "../pages/AccountPage"
import VerifyPage from "../pages/VerifyPage"
import CartPage from "../pages/CartPage"
import PayPage from "../pages/PayPage"
import SellerPage from "../pages/SellerPage"
import AdminLayout from "../componentes/AdminLayout"
import AdminResumenPage from "../pages/AdminResumenPage"
import AdminModeracionPage from "../pages/AdminModeracionPage"
import AdminUsuariosPage from "../pages/AdminUsuariosPage"
import AdminProximamentePage from "../pages/AdminProximamentePage"
import AboutPage from "../pages/AboutPage"
import { NOSOTROS } from "../data/nosotros"
import HelpPage from "../pages/HelpPage"
import FaqPage from "../pages/FaqPage"
import ContactPage from "../pages/ContactPage"
import ShippingPolicyPage from "../pages/ShippingPolicyPage"
import PublicSellerProfile from "../pages/PublicSellerProfile"
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminResumenPage />} />
        <Route path="moderacion" element={<AdminModeracionPage />} />
        <Route path="usuarios" element={<AdminUsuariosPage />} />
        <Route path="categorias" element={<AdminProximamentePage seccion="Categorías" />} />
        <Route path="envios" element={<AdminProximamentePage seccion="Tarifas de envío" />} />
        <Route path="ordenes" element={<AdminProximamentePage seccion="Órdenes" />} />
        <Route path="pagos" element={<AdminProximamentePage seccion="Pagos" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<CatalogPage />} />
        <Route path="/libro/:id" element={<BookDetailPage />} />
        <Route path="/ingresar" element={<AuthPage tab="login" />} />
        <Route path="/registrarse" element={<AuthPage tab="register" />} />
        <Route path="/confirmar" element={<VerifyPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/pago/:n" element={<PayPage />} />
        <Route path="/vender" element={<SellerPage />} />
        <Route path="/vender/:tab" element={<SellerPage />} />
        <Route path="/vender/:tab/:id" element={<SellerPage />} />
        <Route path="/vendedor/:id" element={<PublicSellerProfile />} />
        <Route path="/cuenta" element={<AccountPage />} />
        <Route path="/cuenta/:tab" element={<AccountPage />} />
        <Route path={NOSOTROS.to} element={<AboutPage />} />
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/ayuda/preguntas-frecuentes" element={<FaqPage />} />
        <Route path="/ayuda/contacto" element={<ContactPage />} />
        <Route path="/ayuda/envios" element={<ShippingPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
