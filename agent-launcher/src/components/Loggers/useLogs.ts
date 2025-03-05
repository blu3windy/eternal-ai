import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoggersStore {
    showLogs: boolean;
    toggleLogs: () => void;
}

export const useLoggersStore = create<LoggersStore>()(
   persist(
      (set) => ({
         showLogs: false, // Default value
         toggleLogs: () => set((state) => ({ showLogs: !state.showLogs })),
      }),
      {
         name: "loggers-store", // Key for localStorage
      }
   )
);