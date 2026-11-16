import { createSelector } from "@reduxjs/toolkit";

// Selectores compartidos: cada componente lee solo el dato que usa, así no se vuelve a renderizar
// por cambios de otras partes del slice (por ejemplo, la lista de usuarios del admin dentro de `user`).

// --- Sesión ---
export const selectUser = (state) => state.user.user;
export const selectMarks = (state) => state.user.marks;
export const selectDirecciones = (state) => state.user.direcciones;
export const selectPendiente = (state) => state.user.pendiente;
export const selectEsAdmin = (state) => state.user.user?.rol === "ADMIN";

// --- Compra ---
export const selectCarrito = (state) => state.carrito.items;
export const selectPedidos = (state) => state.pedidos.items;

// Lo que necesita useCompra en un solo objeto. createSelector devuelve el mismo objeto mientras no cambie
// ninguna de las cuatro partes, así useSelector no fuerza renders de más.
export const selectCompra = createSelector(
  [selectUser, selectMarks, selectCarrito, selectPedidos],
  (user, marks, carrito, pedidos) => ({ user, marks, carrito, pedidos }),
);

// --- Catálogo (muestra del inicio, carruseles y sugerencias) ---
// Lo que necesita useLibros en un solo objeto, con la misma memorización.
export const selectCatalogo = createSelector(
  [
    (state) => state.libros.items,
    (state) => state.libros.loading,
    (state) => state.libros.error,
    (state) => state.libros.categorias.items,
  ],
  (libros, loading, error, listaCategorias) => ({ libros, loading, error, listaCategorias }),
);