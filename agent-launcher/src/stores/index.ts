import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { getPersistConfig } from "redux-deep-persist";
import { persistCombineReducers, persistStore } from "redux-persist";
import persistLocalStorage from "redux-persist/lib/storage";
import reducer from "./reducer";

const reducers = combineReducers(reducer);

const persistConfig = getPersistConfig({
   key: "root",
   storage: persistLocalStorage,
   blacklist: ['floatingWebView', 'layoutView'],
   rootReducer: reducers,
});

const persistedReducer = persistCombineReducers(persistConfig, reducer);

export const makeStore = () => {
   return configureStore({
      reducer: persistedReducer,
      devTools: true,
      middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
         }),
   });
};

export const store = makeStore();

// DEBUG State change Redux (instead of redux-logger...)

// const unsubscribe = store.subscribe(() =>
//   console.log('State after dispatch: ', store.getState()),
// );
// unsubscribe()

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
