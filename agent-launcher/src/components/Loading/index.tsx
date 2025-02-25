import cs from 'clsx';
import s from './styles.module.scss';
import { Spinner } from '@chakra-ui/react';
import { ReactElement } from 'react';

export default function Loading({ className }: { className?: string }): ReactElement {
  return (
    <div className={cs(className, s.loading)}>
      <Spinner size='md' speed='0.65s' emptyColor='gray.200' color='blue.500' />
    </div>
  );
}
