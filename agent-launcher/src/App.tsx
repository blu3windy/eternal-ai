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

function App() {
   const [updateAvailable, setUpdateAvailable] = useState(false);
   const [updateDownloadProcessing, setUpdateDownloadProcessing] = useState<any>(false);





   useEffect(() => {

      if (globalThis.electronAPI) {
         globalThis.electronAPI.onCheckForUpdate();
         globalThis.electronAPI.onUpdateAvailable(() => {
            setUpdateAvailable(true);
         });
         globalThis.electronAPI.onUpdateDownloadProcessing((progress) => {
            console.log(progress);

            setUpdateDownloadProcessing(progress);
         });
      }


      // 1 min = ? milisecond
      const oneMinute = 60000;
      setInterval(() => {
         globalThis.electronAPI.onCheckForUpdate();
      }, oneMinute);


   }, []);


   const handleUpdateDownloaded = () => {
      setUpdateDownloadProcessing({
         percent: 0
      });
      globalThis.electronAPI.onUpdateDownloaded();
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
               onClick={updateDownloadProcessing ? undefined : handleUpdateDownloaded}
               style={{
                  cursor: updateDownloadProcessing ? "default" : "pointer"
               }}
            >

               <Flex alignItems={"center"} gap={4}>
                  {
                     updateDownloadProcessing ? <>
                        <Spinner size="sm" />
                        <Box>
                           <Text fontWeight={700} fontSize={"16px"}>Downloading... {updateDownloadProcessing?.percent?.toFixed(0)}%</Text>
                           <Text fontSize={"12px"} opacity={0.7}>The app will automatically restart when finished.</Text>
                        </Box>

                     </> : <>
                        🎉
                        <Box>
                           <Text fontWeight={700} fontSize={"16px"}>Update available!</Text>
                           <Text fontSize={"12px"} opacity={0.7}>Click to download and install the latest version. Current conversation will be saved.</Text>
                        </Box>
                     </>
                  }

               </Flex>
               {!updateDownloadProcessing &&
                  // add button close
                  // svg icon close 
                  <Box onClick={() => setUpdateAvailable(false)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </Box>
               }
            </motion.div>
         )}
      </>
   );
}

export default App;
