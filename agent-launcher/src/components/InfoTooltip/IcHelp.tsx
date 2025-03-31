import { Image } from "@chakra-ui/react";

type Color = 'white' | 'black' | 'red' | string;


const IcHelp = ({ color = 'black' } : { color?: Color }) => {
   return <Image src={color === 'red' ? `icons/ic-tooltip-red.svg` : color === 'black' ? `icons/ic-tooltip.svg` : `icons/ic-tooltip-white.svg`} />;
};

export default IcHelp;
