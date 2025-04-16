import cs from 'clsx';
import s from './styles.module.scss';
import { Spinner } from '@chakra-ui/react';
import { ReactElement } from 'react';

export default function Loading({ className, size = 24 }: { className?: string; size?: number; }): ReactElement {
   return (
      <div className={cs(className, s.loading)} style={{ width: size, height: size }}>
         <Spinner size='md' speed='0.65s' emptyColor='gray.200' color='blue.500' />
      </div>
   );
}
