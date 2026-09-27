import { Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  );
}

export default AppRoutes;