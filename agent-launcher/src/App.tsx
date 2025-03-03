import { BrowserRouter, Route, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import Home from "./pages/home";
import Mine from "./pages/mine";
import { AuthProvider } from "./pages/authen/provider.tsx";
import { persistor, store } from "@stores";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

function App() {

   useEffect(() => {
      console.log('LEON useEffect');
   }, []);
   return (
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
               <BrowserRouter>
                  <Routes>
                     <Route path={ROUTERS.HOME} element={<Home />} />
                     <Route path={ROUTERS.MINE} element={<Mine />} />
                  </Routes>
               </BrowserRouter>
            </AuthProvider>
         </PersistGate>
      </Provider>
   );
}

export default App;
