import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../componentes/Layout'
import RutaComprador from '../componentes/RutaComprador'
import AdminLayout from '../componentes/AdminLayout'
import { NOSOTROS } from '../data/nosotros'

// Cada página se descarga recién al navegar a su ruta. Así el catálogo público no
// arrastra el código de cuenta, ventas y administración en su primer render.
const HomePage = lazy(() => import('../pages/HomePage'))
const CatalogPage = lazy(() => import('../pages/CatalogPage'))
const BookDetailPage = lazy(() => import('../pages/BookDetailPage'))
const AuthPage = lazy(() => import('../pages/AuthPage'))
const AccountPage = lazy(() => import('../pages/AccountPage'))
const VerifyPage = lazy(() => import('../pages/VerifyPage'))
const RecoverPage = lazy(() => import('../pages/RecoverPage'))
const CartPage = lazy(() => import('../pages/CartPage'))
const PayPage = lazy(() => import('../pages/PayPage'))
const SellerPage = lazy(() => import('../pages/SellerPage'))
const AdminResumenPage = lazy(() => import('../pages/AdminResumenPage'))
const AdminModeracionPage = lazy(() => import('../pages/AdminModeracionPage'))
const AdminUsuariosPage = lazy(() => import('../pages/AdminUsuariosPage'))
const AdminCategoriasPage = lazy(() => import('../pages/AdminCategoriasPage'))
const AdminEnviosPage = lazy(() => import('../pages/AdminEnviosPage'))
const AdminOrdenesPage = lazy(() => import('../pages/AdminOrdenesPage'))
const AdminPagosPage = lazy(() => import('../pages/AdminPagosPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const HelpPage = lazy(() => import('../pages/HelpPage'))
const FaqPage = lazy(() => import('../pages/FaqPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const ShippingPolicyPage = lazy(() => import('../pages/ShippingPolicyPage'))
const PublicSellerProfile = lazy(() => import('../pages/PublicSellerProfile'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<main className="usr" aria-busy="true" />}>
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminResumenPage />} />
        <Route path="moderacion" element={<AdminModeracionPage />} />
        <Route path="usuarios" element={<AdminUsuariosPage />} />
        <Route path="categorias" element={<AdminCategoriasPage />} />
        <Route path="envios" element={<AdminEnviosPage />} />
        <Route path="ordenes" element={<AdminOrdenesPage />} />
        <Route path="pagos" element={<AdminPagosPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<CatalogPage />} />
        <Route path="/libro/:id" element={<BookDetailPage />} />
        <Route path="/vendedor/:id" element={<PublicSellerProfile />} />
        <Route path="/ingresar" element={<AuthPage tab="login" />} />
        <Route path="/registrarse" element={<AuthPage tab="register" />} />
        <Route path="/confirmar" element={<VerifyPage />} />
        <Route path="/recuperar" element={<RecoverPage />} />

        {/* Solo compradores y vendedores: el administrador no tiene perfil de comprador y va a /admin */}
        <Route element={<RutaComprador />}>
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/pago/:n" element={<PayPage />} />
          <Route path="/vender" element={<SellerPage />} />
          <Route path="/vender/:tab" element={<SellerPage />} />
          <Route path="/vender/:tab/:id" element={<SellerPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
          <Route path="/cuenta/:tab" element={<AccountPage />} />
          <Route path={NOSOTROS.to} element={<AboutPage />} />
          <Route path="/ayuda" element={<HelpPage />} />
          <Route path="/ayuda/preguntas-frecuentes" element={<FaqPage />} />
          <Route path="/ayuda/contacto" element={<ContactPage />} />
          <Route path="/ayuda/envios" element={<ShippingPolicyPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </Suspense>
  )
}

export default AppRoutes
