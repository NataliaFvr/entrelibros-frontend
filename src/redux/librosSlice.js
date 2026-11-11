import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront } from "../api/adaptadores";
import { editarCategoria } from "./categoriasSlice";
import { moderar } from "./moderacionSlice";
import { cambiarRol, darDeBajaUsuario } from "./usuariosSlice";
import { cambiarEstadoLibro, editarLibro } from "./vendedorSlice";
import { cancelarVenta } from "./ventasSlice";
import api from "../api/axiosConfig";

const URL = "/libros";

export const fetchLibros = createAsyncThunk("libros/fetchlibros", async () => {
  const { data } = await api.get(URL, { params: { sort: "bestsellers", page: 0, size: 100 } });
  return data.content.map(aLibroFront);
});

const librosSlice = createSlice({
  name: "libros",
  initialState: {
    items: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibros.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLibros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Lo que hace el vendedor se refleja en el catálogo con la respuesta del back, sin volver a pedir todos los libros
      .addCase(cambiarEstadoLibro.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload.id);
        if (action.meta.arg.activo && action.payload.estadoModeracion === "ACEPTADO") state.items.push(action.payload);
      })
      .addCase(editarLibro.fulfilled, (state, action) => {
        const { pub, enviadoARevision, libro } = action.payload;
        const index = state.items.findIndex((l) => l.id === pub.id);
        if (index === -1) return;
        if (enviadoARevision) state.items.splice(index, 1); // no se ve en el catálogo hasta que el admin lo apruebe
        else if (libro) state.items[index] = { ...libro, imgs: pub.imgs.slice(0, 1) };
      })
      .addCase(editarCategoria.fulfilled, (state, action) => {
        const { actual } = action.meta.arg;
        const nuevo = action.payload.nombre;
        state.items.forEach((l) => {
          l.cats = l.cats.map((c) => (c === actual ? nuevo : c));
          if (l.cat === actual) l.cat = nuevo;
        });
      })
      // Un libro aprobado aparece en el catálogo con la respuesta del back
      .addCase(moderar.fulfilled, (state, action) => {
        if (!action.meta.arg.accion.aprobado || action.payload.estadoPublicacion !== "ACTIVA") return;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        else state.items.push(action.payload);
      })
      // El back da de baja los libros del vendedor que se da de baja o deja de ser vendedor
      .addCase(darDeBajaUsuario.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.vId !== action.payload.id);
      })
      .addCase(cambiarRol.fulfilled, (state, action) => {
        if (action.payload.rol !== "VENDEDOR") state.items = state.items.filter((l) => l.vId !== action.payload.id);
      })
      .addCase(cancelarVenta.fulfilled, (state, action) => {
        (action.payload.items || []).forEach((item) => {
          const libro = state.items.find((l) => l.id === item.idLibro);
          if (libro) libro.stock += item.cantidad;
        });
      });
  },
});

export default librosSlice.reducer;