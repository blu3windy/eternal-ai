import { BrowserRouter, Route, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import Home from "./pages/home";
import Mine from "./pages/mine";
import { AuthProvider } from "./pages/authen/provider.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTERS.HOME} element={<Home />} />
          <Route path={ROUTERS.MINE} element={<Mine />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
