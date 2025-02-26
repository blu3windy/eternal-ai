import { useEffect, useRef } from "react";

const AUTO_LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds

const useAutoLogout = () => {
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Reset timeout function
   const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
         alert("You have been logged out due to inactivity.");
      }, AUTO_LOGOUT_TIME);
   };

   // Listen to user activity
   useEffect(() => {
      const events = ["mousemove", "keydown", "click"];

      events.forEach((event) => {
         window.addEventListener(event, resetTimer);
      });

      resetTimer(); // Initialize timer

      return () => {
         events.forEach((event) => {
            window.removeEventListener(event, resetTimer);
         });
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, []);

   return null;
};


export default useAutoLogout;