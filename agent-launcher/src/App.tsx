import "./styles/global.scss";

import { persistor, store } from "@stores/index.ts";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import { AuthProvider } from "./pages/authen/provider.tsx";
import Home from "./pages/home";
import Mine from "./pages/mine";

import SyncTaskFromStorage from "@providers/SyncTaskFromStorage/index.tsx";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import s from "./styles/styles.module.scss";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import FloatingWebView from "@providers/FloatingWebView/index.tsx";
import UpdateBanner from "@components/UpdateBanner/index.tsx";

function App() {

   useEffect(() => {
      console.log('App');
   }, []);

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
