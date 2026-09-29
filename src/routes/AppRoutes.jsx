import { Routes, Route } from 'react-router-dom'
import Layout from '../componentes/layout/Layout'
import HomePage from '../pages/HomePage'
import CatalogPage from '../pages/CatalogPage'
import BookDetailPage from '../pages/BookDetailPage'
import NotFoundPage from '../pages/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/libros" element={<CatalogPage />} />
        <Route path="/libro/:id" element={<BookDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
