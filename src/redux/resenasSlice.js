import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOpinionesVendedor } from "../api/opinionesApi";
import {
  crearResenaLibroApi, crearResenaVendedorApi, eliminarResenaLibroApi, eliminarResenaVendedorApi, getEstadoResenaLibroApi,
  getEstadoResenaVendedorApi, getResenasLibroApi, getResenasVendedorApi, getTodasResenasLibroApi, getTodasResenasVendedorApi,
  modificarResenaLibroApi, modificarResenaVendedorApi,
} from "../api/resenasApi";
import { confirmarEmail, login, logout } from "./userSlice";

// --- Reseñas de libros ---
export const fetchResenasLibro = createAsyncThunk("resenas/fetchResenasLibro", async (idLibro) => getResenasLibroApi(idLibro), {
  condition: (idLibro, { getState }) => {
    const { resenas } = getState();
    return resenas.libros[idLibro] === undefined && !resenas.solicitudes.libros[idLibro];
  },
});

export const fetchEstadoResenaLibro = createAsyncThunk("resenas/fetchEstadoResenaLibro", async (idLibro) => getEstadoResenaLibroApi(idLibro), {
  condition: (idLibro, { getState }) => {
    const { resenas } = getState();
    return resenas.estadosLibro[idLibro] === undefined && !resenas.solicitudes.estadosLibro[idLibro];
  },
});

export const publicarResenaLibro = createAsyncThunk("resenas/publicarResenaLibro", async ({ idOrdenItem, miResenia, opinion }) => {
  const cuerpo = { calificacion: opinion.st, comentario: opinion.t };
  return miResenia ? modificarResenaLibroApi(miResenia.id, cuerpo) : crearResenaLibroApi({ idOrdenItem, ...cuerpo });
});

// `resena` = la reseña que se borra (trae idLibro e idOrdenItem)
export const eliminarResenaLibro = createAsyncThunk("resenas/eliminarResenaLibro", async (resena) => {
  await eliminarResenaLibroApi(resena.id);
  return resena;
});

// --- Reseñas de vendedores ---
export const fetchResenasVendedor = createAsyncThunk("resenas/fetchResenasVendedor", async (idVendedor) => getResenasVendedorApi(idVendedor), {
  condition: (idVendedor, { getState }) => {
    const { resenas } = getState();
    return resenas.vendedores[idVendedor] === undefined && !resenas.solicitudes.vendedores[idVendedor];
  },
});

export const fetchEstadoResenaVendedor = createAsyncThunk("resenas/fetchEstadoResenaVendedor", async (idVendedor) =>
  getEstadoResenaVendedorApi(idVendedor), {
  condition: (idVendedor, { getState }) => {
    const { resenas } = getState();
    return resenas.estadosVendedor[idVendedor] === undefined && !resenas.solicitudes.estadosVendedor[idVendedor];
  },
});

export const publicarResenaVendedor = createAsyncThunk("resenas/publicarResenaVendedor", async ({ idVendedor, idPago, miResena, clasificacion, comentario }) => {
  const cuerpo = { idPago, idVendedor, clasificacion, comentario };
  return miResena ? modificarResenaVendedorApi(miResena.id, cuerpo) : crearResenaVendedorApi(cuerpo);
});

export const eliminarResenaVendedor = createAsyncThunk("resenas/eliminarResenaVendedor", async (resena) => {
  await eliminarResenaVendedorApi(resena.id);
  return resena;
});

// Opiniones de todos los libros que vendió un vendedor (su pestaña "Reputación")
export const fetchOpinionesVendedor = createAsyncThunk("resenas/fetchOpinionesVendedor", async (idVendedor) => getOpinionesVendedor(idVendedor), {
  condition: (idVendedor, { getState }) => {
    const { resenas } = getState();
    return resenas.opinionesVendedor[idVendedor] === undefined && !resenas.solicitudes.opinionesVendedor[idVendedor];
  },
});

// --- Admin: todas las reseñas ---
export const fetchTodasResenas = createAsyncThunk("resenas/fetchTodasResenas", async () => {
  const [libros, vendedores] = await Promise.all([getTodasResenasLibroApi(), getTodasResenasVendedorApi()]);
  return { libros, vendedores };
}, {
  condition: (_, { getState }) => !getState().resenas.solicitudes.todas,
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
    solicitudes: {
      libros: {},
      estadosLibro: {},
      vendedores: {},
      estadosVendedor: {},
      opinionesVendedor: {},
      todas: false,
    },
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
      .addCase(fetchResenasLibro.pending, (state, action) => {
        state.solicitudes.libros[action.meta.arg] = true;
      })
      .addCase(fetchResenasLibro.fulfilled, (state, action) => {
        delete state.solicitudes.libros[action.meta.arg];
        state.libros[action.meta.arg] = action.payload;
      })
      .addCase(fetchResenasLibro.rejected, (state, action) => {
        delete state.solicitudes.libros[action.meta.arg];
        state.libros[action.meta.arg] = [];
      })
      .addCase(fetchEstadoResenaLibro.pending, (state, action) => {
        state.solicitudes.estadosLibro[action.meta.arg] = true;
      })
      .addCase(fetchEstadoResenaLibro.fulfilled, (state, action) => {
        delete state.solicitudes.estadosLibro[action.meta.arg];
        state.estadosLibro[action.meta.arg] = action.payload;
      })
      .addCase(fetchEstadoResenaLibro.rejected, (state, action) => {
        delete state.solicitudes.estadosLibro[action.meta.arg];
        state.estadosLibro[action.meta.arg] = {
          puedeResenar: false,
          motivo: action.error.message,
          idOrdenItem: null,
          miResenia: null,
        };
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
      .addCase(fetchResenasVendedor.pending, (state, action) => {
        state.solicitudes.vendedores[action.meta.arg] = true;
      })
      .addCase(fetchResenasVendedor.fulfilled, (state, action) => {
        delete state.solicitudes.vendedores[action.meta.arg];
        state.vendedores[action.meta.arg] = action.payload;
      })
      .addCase(fetchResenasVendedor.rejected, (state, action) => {
        delete state.solicitudes.vendedores[action.meta.arg];
        state.vendedores[action.meta.arg] = [];
      })
      .addCase(fetchEstadoResenaVendedor.pending, (state, action) => {
        state.solicitudes.estadosVendedor[action.meta.arg] = true;
      })
      .addCase(fetchEstadoResenaVendedor.fulfilled, (state, action) => {
        delete state.solicitudes.estadosVendedor[action.meta.arg];
        state.estadosVendedor[action.meta.arg] = action.payload;
      })
      .addCase(fetchEstadoResenaVendedor.rejected, (state, action) => {
        delete state.solicitudes.estadosVendedor[action.meta.arg];
        state.estadosVendedor[action.meta.arg] = {
          puedeResenar: false,
          motivo: action.error.message,
          idPago: null,
          miResena: null,
        };
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
      .addCase(fetchOpinionesVendedor.pending, (state, action) => {
        state.solicitudes.opinionesVendedor[action.meta.arg] = true;
      })
      .addCase(fetchOpinionesVendedor.fulfilled, (state, action) => {
        delete state.solicitudes.opinionesVendedor[action.meta.arg];
        state.opinionesVendedor[action.meta.arg] = action.payload;
      })
      .addCase(fetchOpinionesVendedor.rejected, (state, action) => {
        delete state.solicitudes.opinionesVendedor[action.meta.arg];
        state.opinionesVendedor[action.meta.arg] = [];
      })
      .addCase(fetchTodasResenas.pending, (state) => {
        state.solicitudes.todas = true;
        state.errorTodas = null;
      })
      .addCase(fetchTodasResenas.fulfilled, (state, action) => {
        state.solicitudes.todas = false;
        state.todasLibro = action.payload.libros;
        state.todasVendedor = action.payload.vendedores;
        state.todasCargadas = true;
      })
      .addCase(fetchTodasResenas.rejected, (state, action) => {
        state.solicitudes.todas = false;
        state.errorTodas = action.error.message;
      });
  },
});

export default resenasSlice.reducer;
