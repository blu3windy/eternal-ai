import { Routes, Route } from "react-router";
import PackageCore from "./pages/package-core";
import Home from "./pages/home";
import PackageInteract from "./pages/package-interact";

function App() {
  return (
    <Routes>
      <Route path="package-core" element={<PackageCore />} />
      <Route path="package-interact" element={<PackageInteract />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
