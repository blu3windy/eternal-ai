import { useInViewport } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const useInViewportOnce = () => {
   const { ref, inViewport } = useInViewport();
   const [hasBeenInView, setHasBeenInView] = useState(inViewport);

   useEffect(() => {
      if (inViewport && !hasBeenInView) {
         setHasBeenInView(true);
      }
   }, [inViewport, hasBeenInView]);

   return { ref, inViewport: hasBeenInView };
}

export default useInViewportOnce;