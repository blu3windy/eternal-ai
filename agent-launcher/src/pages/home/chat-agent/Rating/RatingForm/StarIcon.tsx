const StarIcon = (params: { isActive: boolean }) => {
   const { isActive } = params;
   if (isActive) {
      return (
         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M16.59 36L18.54 27.1263L12 21.1579L20.64 20.3684L24 12L27.36 20.3684L36 21.1579L29.46 27.1263L31.41 36L24 31.2947L16.59 36Z" fill="url(#paint0_linear_55209_9560)"/>
            <defs>
               <linearGradient id="paint0_linear_55209_9560" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFD36E"/>
                  <stop offset="1" stop-color="#F6B828"/>
               </linearGradient>
            </defs>
         </svg>
      )
   }
   
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
         <path d="M17.3362 34.9339L19.0283 27.2336L19.0903 26.9516L18.877 26.757L13.1743 21.5527L20.6855 20.8663L20.99 20.8385L21.104 20.5547L24 13.3419L26.896 20.5547L27.01 20.8385L27.3145 20.8663L34.8257 21.5527L29.123 26.757L28.9097 26.9516L28.9717 27.2336L30.6638 34.9339L24.268 30.8726L24 30.7025L23.732 30.8726L17.3362 34.9339Z" stroke="url(#paint0_linear_55209_9564)"/>
         <defs>
            <linearGradient id="paint0_linear_55209_9564" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
               <stop stop-color="#FFD36E"/>
               <stop offset="1" stop-color="#F6B828"/>
            </linearGradient>
         </defs>
      </svg>
   )
}

export default StarIcon;