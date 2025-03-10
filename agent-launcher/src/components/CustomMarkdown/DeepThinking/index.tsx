import { CustomComponentProps } from '../types';
import { Image, Text } from '@chakra-ui/react';
import s from './styles.module.scss';
import cx from 'clsx';

function DeepThinking({
   node,
   children,
   isLight = false,
   removeThink = false,
}: CustomComponentProps & {
  isLight?: boolean;
  removeThink?: boolean;
}) {
   if (removeThink) {
      return <></>;
   }
   return (
      <details className={cx(s.details, isLight ? s.isLight : '')} open={true}>
         <summary>
            <Image
               src={
                  isLight
                     ? 'icons/agent/brain-dark.svg'
                     : 'icons/agent/brain.svg'
               }
            />
            <Text>Think</Text>
         </summary>
         <p className={s.thinkText}>{children}</p>
      </details>
   );
}

export default DeepThinking;
