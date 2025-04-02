import "./styles/global.scss";

import { persistor, store } from "@stores/index.ts";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import ROUTERS from "./constants/route-path";
import { AuthProvider } from "./pages/authen/provider.tsx";
import Home from "./pages/home";
import Mine from "./pages/mine";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import SyncTaskFromStorage from "@providers/SyncTaskFromStorage/index.tsx";
import { useEffect, useState } from "react";
import s from "./styles/styles.module.scss";

import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@chakra-ui/react";

function App() {
   const [updateAvailable, setUpdateAvailable] = useState(false);

   useEffect(() => {

      if (globalThis.electronAPI) {
         globalThis.electronAPI.onUpdateAvailable(() => {
            setUpdateAvailable(true);
         });
         globalThis.electronAPI.onUpdateDownloadProcessing((progress) => {
            console.log("onUpdateDownloadProcessing", progress);
         });
      }
   }, []);


   const handleUpdateDownloaded = () => {
      globalThis.electronAPI.onUpdateDownloaded(() => {
         console.log("onUpdateDownloaded");
      });
   }


   return (
      <>

         <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
               <SyncTaskFromStorage />
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
         {(updateAvailable) && (
            <motion.div
               initial={{ y: 0, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 0, opacity: 0 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className={`${s.snackbar}`}
               onClick={handleUpdateDownloaded}
               style={{
                 cursor: "pointer"
               }}
            >
               <Text>
                  {"App update available! Click to download the latest version."}
               </Text>
            </motion.div>
         )}
      </>
   );
}

export default App;
