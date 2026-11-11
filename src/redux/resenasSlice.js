import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOpinionesVendedor } from "../api/opinionesApi";
import {
  crearResenaLibroApi, crearResenaVendedorApi, eliminarResenaLibroApi, eliminarResenaVendedorApi, getEstadoResenaLibroApi,
  getEstadoResenaVendedorApi, getResenasLibroApi, getResenasVendedorApi, getTodasResenasLibroApi, getTodasResenasVendedorApi,
  modificarResenaLibroApi, modificarResenaVendedorApi,
} from "../api/resenasApi";
import { confirmarEmail, login, logout } from "./authSlice";

// --- Reseñas de libros ---
export const fetchResenasLibro = createAsyncThunk("resenas/fetchresenaslibro", async (idLibro) => getResenasLibroApi(idLibro));

export const fetchEstadoResenaLibro = createAsyncThunk("resenas/fetchestadoresenalibro", async (idLibro) => getEstadoResenaLibroApi(idLibro));

export const publicarResenaLibro = createAsyncThunk("resenas/publicarresenalibro", async ({ idOrdenItem, miResenia, opinion }) => {
  const cuerpo = { calificacion: opinion.st, comentario: opinion.t };
  return miResenia ? modificarResenaLibroApi(miResenia.id, cuerpo) : crearResenaLibroApi({ idOrdenItem, ...cuerpo });
});

// `resena` = la reseña que se borra (trae idLibro e idOrdenItem)
export const eliminarResenaLibro = createAsyncThunk("resenas/eliminarresenalibro", async (resena) => {
  await eliminarResenaLibroApi(resena.id);
  return resena;
});

// --- Reseñas de vendedores ---
export const fetchResenasVendedor = createAsyncThunk("resenas/fetchresenasvendedor", async (idVendedor) => getResenasVendedorApi(idVendedor));

export const fetchEstadoResenaVendedor = createAsyncThunk("resenas/fetchestadoresenavendedor", async (idVendedor) =>
  getEstadoResenaVendedorApi(idVendedor));

export const publicarResenaVendedor = createAsyncThunk("resenas/publicarresenavendedor", async ({ idVendedor, idPago, miResena, clasificacion, comentario }) => {
  const cuerpo = { idPago, idVendedor, clasificacion, comentario };
  return miResena ? modificarResenaVendedorApi(miResena.id, cuerpo) : crearResenaVendedorApi(cuerpo);
});

export const eliminarResenaVendedor = createAsyncThunk("resenas/eliminarresenavendedor", async (resena) => {
  await eliminarResenaVendedorApi(resena.id);
  return resena;
});

// Opiniones de todos los libros que vendió un vendedor (su pestaña "Reputación")
export const fetchOpinionesVendedor = createAsyncThunk("resenas/fetchopinionesvendedor", async (idVendedor) => getOpinionesVendedor(idVendedor));

// --- Admin: todas las reseñas ---
export const fetchTodasResenas = createAsyncThunk("resenas/fetchtodasresenas", async () => {
  const [libros, vendedores] = await Promise.all([getTodasResenasLibroApi(), getTodasResenasVendedorApi()]);
  return { libros, vendedores };
});

const reemplazarOAgregar = (lista, resena) => {
  if (!lista) return;
  const index = lista.findIndex((r) => r.id === resena.id);
  if (index !== -1) lista[index] = resena;
  else lista.unshift(resena);
};

const sacar = (lista, id) => (lista ? lista.filter((r) => r.id !== id) : lista);

const resenasSlice = createSlice({
  name: "resenas",
  initialState: {
    libros: {}, // idLibro -> reseñas
    estadosLibro: {}, // idLibro -> { puedeResenar, motivo, idOrdenItem, miResenia } de la sesión actual
    vendedores: {}, // idVendedor -> reseñas
    estadosVendedor: {}, // idVendedor -> { puedeResenar, motivo, idPago, miResena }
    opinionesVendedor: {}, // idVendedor -> opiniones de sus libros
    todasLibro: [],
    todasVendedor: [],
    todasCargadas: false,
    errorTodas: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // El "¿puedo opinar?" depende de quién tiene la sesión
    const olvidarEstados = (state) => {
      state.estadosLibro = {};
      state.estadosVendedor = {};
    };
    builder
      .addCase(login.fulfilled, olvidarEstados)
      .addCase(logout.fulfilled, olvidarEstados)
      .addCase(confirmarEmail.fulfilled, olvidarEstados)
      .addCase(fetchResenasLibro.fulfilled, (state, action) => {
        state.libros[action.meta.arg] = action.payload;
      })
      .addCase(fetchResenasLibro.rejected, (state, action) => {
        state.libros[action.meta.arg] = [];
      })
      .addCase(fetchEstadoResenaLibro.fulfilled, (state, action) => {
        state.estadosLibro[action.meta.arg] = action.payload;
      })
      .addCase(publicarResenaLibro.fulfilled, (state, action) => {
        const resena = action.payload;
        reemplazarOAgregar(state.libros[resena.idLibro], resena);
        if (state.todasCargadas) reemplazarOAgregar(state.todasLibro, resena);
        state.estadosLibro[resena.idLibro] = { puedeResenar: false, motivo: "Ya opinaste sobre este libro.", idOrdenItem: null, miResenia: resena };
      })
      .addCase(eliminarResenaLibro.fulfilled, (state, action) => {
        const resena = action.payload;
        state.libros[resena.idLibro] = sacar(state.libros[resena.idLibro], resena.id);
        state.todasLibro = sacar(state.todasLibro, resena.id);
        Object.keys(state.opinionesVendedor).forEach((id) => {
          state.opinionesVendedor[id] = sacar(state.opinionesVendedor[id], resena.id);
        });
        // Si era la propia, con esa compra se puede volver a opinar
        const estado = state.estadosLibro[resena.idLibro];
        if (estado && estado.miResenia && estado.miResenia.id === resena.id) {
          state.estadosLibro[resena.idLibro] = { puedeResenar: true, motivo: "", idOrdenItem: resena.idOrdenItem, miResenia: null };
        }
      })
      .addCase(fetchResenasVendedor.fulfilled, (state, action) => {
        state.vendedores[action.meta.arg] = action.payload;
      })
      .addCase(fetchResenasVendedor.rejected, (state, action) => {
        state.vendedores[action.meta.arg] = [];
      })
      .addCase(fetchEstadoResenaVendedor.fulfilled, (state, action) => {
        state.estadosVendedor[action.meta.arg] = action.payload;
      })
      .addCase(publicarResenaVendedor.fulfilled, (state, action) => {
        const resena = action.payload;
        const idVendedor = action.meta.arg.idVendedor;
        reemplazarOAgregar(state.vendedores[idVendedor], resena);
        if (state.todasCargadas) reemplazarOAgregar(state.todasVendedor, resena);
        state.estadosVendedor[idVendedor] = { puedeResenar: false, motivo: "Ya calificaste a este vendedor.", idPago: null, miResena: resena };
      })
      .addCase(eliminarResenaVendedor.fulfilled, (state, action) => {
        const resena = action.payload;
        state.vendedores[resena.idVendedor] = sacar(state.vendedores[resena.idVendedor], resena.id);
        state.todasVendedor = sacar(state.todasVendedor, resena.id);
        const estado = state.estadosVendedor[resena.idVendedor];
        if (estado && estado.miResena && estado.miResena.id === resena.id) {
          state.estadosVendedor[resena.idVendedor] = { puedeResenar: true, motivo: "", idPago: resena.idPago, miResena: null };
        }
      })
      .addCase(fetchOpinionesVendedor.fulfilled, (state, action) => {
        state.opinionesVendedor[action.meta.arg] = action.payload;
      })
      .addCase(fetchOpinionesVendedor.rejected, (state, action) => {
        state.opinionesVendedor[action.meta.arg] = [];
      })
      .addCase(fetchTodasResenas.pending, (state) => {
        state.errorTodas = null;
      })
      .addCase(fetchTodasResenas.fulfilled, (state, action) => {
        state.todasLibro = action.payload.libros;
        state.todasVendedor = action.payload.vendedores;
        state.todasCargadas = true;
      })
      .addCase(fetchTodasResenas.rejected, (state, action) => {
        state.errorTodas = action.error.message;
      });
  },
});

export default resenasSlice.reducer;
