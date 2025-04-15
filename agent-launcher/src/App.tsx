import "./styles/global.scss";

import { persistor, store } from "@stores/index.ts";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import { AuthProvider } from "./pages/authen/provider.tsx";
import Home from "./pages/home";
import Mine from "./pages/mine";

import SyncTaskFromStorage from "@providers/SyncTaskFromStorage/index.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import FloatingWebView from "@providers/FloatingWebView/index.tsx";
import UpdateBanner from "@components/UpdateBanner/index.tsx";
import { ErrorManagerProvider } from "@providers/ErrorManager/index.tsx";
// import { DockerMonitorProvider } from "@providers/DockerMonitor/index.tsx";

function App() {
   return (
      <>
            <Provider store={store}>
               <PersistGate loading={null} persistor={persistor}>
                  <SyncTaskFromStorage />
                  <FloatingWebView />
                  <UpdateBanner />
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
      </>
   );
}

export default App;
