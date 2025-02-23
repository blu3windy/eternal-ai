import { BrowserRouter, Route, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
// import Home from "./pages/home";
import Authen from "./pages/authen";

import "./styles/global.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTERS.HOME} element={<Authen />} />
          <Route path={ROUTERS.AUTHEN} element={<Authen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
