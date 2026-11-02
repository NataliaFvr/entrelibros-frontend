import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront } from "../api/adaptadores";
import api from "../api/axiosConfig";
import { mensajeError } from "../utils/errorApi";

const URL = "/libros";

export const fetchLibros = createAsyncThunk("libros/fetchlibros", async () => {
  try {
    const { data } = await api.get(URL, { params: { sort: "bestsellers", page: 0, size: 100 } });
    return data.content.map(aLibroFront);
  } catch (err) {
    throw new Error(mensajeError(err));
  }
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
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchLibros.fulfilled, (state, action) => {
        (state.loading = false), (state.items = action.payload);
      })
      .addCase(fetchLibros.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      });
  },
});

export default librosSlice.reducer;