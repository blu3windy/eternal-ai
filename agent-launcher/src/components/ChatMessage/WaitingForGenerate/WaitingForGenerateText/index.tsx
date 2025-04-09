import Lottie from 'lottie-react';
import animation from './voice-animation.json';
import animationBlack from './voice-animation-black.json';
import s from './styles.module.scss';
import { Text } from '@chakra-ui/react';

export function WaitingAnimation({ size = 24, color = 'white' }: { size?: number, color?: string }) {
   return (
      <div
         style={{
            maxWidth: size ? `${size}px` : 'initial',
            minWidth: size ? `${size}px` : 'initial',
            width: size ? `${size}px` : 'initial',
            aspectRatio: '1/1',
            opacity: 0.6,
         }}
         className={s.container}
      >
         <Lottie animationData={color === 'white' ? animation : animationBlack} loop={true} />
      </div>
   );
}
