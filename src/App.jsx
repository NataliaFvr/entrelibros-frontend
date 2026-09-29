import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { LibrosProvider } from "./context/LibrosContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LibrosProvider>
          <AppRoutes />
        </LibrosProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
