import Lottie from 'lottie-react';
import animation from './voice-animation.json';

export function WaitingAnimation({ size = 24 }: { size?: number }) {
   return (
      <div
         style={{
            maxWidth: size ? `${size}px` : 'initial',
            minWidth: size ? `${size}px` : 'initial',
            width: size ? `${size}px` : 'initial',
            aspectRatio: '1/1',
            opacity: 0.6,
         }}
      >
         <Lottie animationData={animation} loop={true} />
      </div>
   );
}
