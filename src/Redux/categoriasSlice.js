import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listarCategoriasApi } from "../api/categoriasApi";
import { mensajeError } from "../utils/errorApi";

export const fetchCategorias = createAsyncThunk("categorias/fetchcategorias", async () => {
  try {
    return await listarCategoriasApi();
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    items: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        (state.loading = false), (state.items = action.payload);
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      });
  },
});

export default categoriasSlice.reducer;