import { BrowserRouter, Route, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import Home from "./pages/home";

import "./styles/global.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTERS.HOME} element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
