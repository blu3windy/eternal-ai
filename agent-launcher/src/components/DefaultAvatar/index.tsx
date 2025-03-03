'use client';

import { Box, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { getAvatarName } from "../../utils/string.ts";

const gradientColor = [
   '#FF7084',
   '#FF4B5A',
   '#65CDA0',
   '#359E67',
   '#FFD17E',
   '#FF9427',
   '#CD6AF2',
   '#9B20EE',
   '#4DADFF',
   '#236EAF',
];

export const DefaultAvatar = ({
   name,
   width,
   height,
   address,
   fontSize,
   hideDefault,
}: {
  name?: string | undefined;
  address?: string | undefined;
  width: any;
  height?: any;
  fontSize?: number | undefined;
  hideDefault?: boolean | undefined;
}) => {
   if (name) {
      let numColor = 0;

      if (address) {
         numColor
        = parseFloat(
               BigNumber.from(address).toBigInt().toString(10).slice(0, 4),
            ) % 10;
      }

      const colors = gradientColor[numColor > 9 ? 0 : numColor];
      return (
         <Box
            style={{
               width: width || '40px',
               height: height || '40px',
               backgroundColor: colors,
               alignItems: 'center',
               justifyContent: 'center',
               display: 'flex',
            }}
            className={'imgError'}
         >
            <Text
               style={{
                  fontWeight: '700',
                  fontSize: `${fontSize ? fontSize : 16}px`,
               }}
            >
               {getAvatarName(name).toUpperCase()}
            </Text>
         </Box>
      );
   }

   return (
      <Box
         style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
         }}
         className={'imgError'}
      >
         {!hideDefault && (
            <Jazzicon
               diameter={Number((width || '40')?.replace('px', ''))}
               seed={jsNumberForAddress(address || '')}
            />
         )}
      </Box>
   );
};
