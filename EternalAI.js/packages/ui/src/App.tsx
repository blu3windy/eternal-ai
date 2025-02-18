import { Routes, Route } from "react-router";
import PackageCore from "./pages/package-core";
import PackageEternalAiJs from "./pages/package-eternalaijs";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path="package-core" element={<PackageCore />} />
      <Route path="package-eternalaijs" element={<PackageEternalAiJs />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
