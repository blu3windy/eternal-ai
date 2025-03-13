import { persistor, store } from "@stores/index.ts";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import { AuthProvider } from "./pages/authen/provider.tsx";
import Home from "./pages/home";
import Mine from "./pages/mine";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function App() {
   return (
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
               <Router basename="/">
                  <Routes>
                     <Route path={ROUTERS.HOME} element={<Home />} />
                     <Route path={ROUTERS.MINE} element={<Mine />} />
                     {/* Wildcard route to catch all unmatched paths */}
                     <Route path="*" element={<Navigate to={ROUTERS.HOME} />} />
                  </Routes>
               </Router>
            </AuthProvider>
         </PersistGate>
      </Provider>
   );
}

export default App;
