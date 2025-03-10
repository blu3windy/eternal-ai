import { Image } from "@chakra-ui/react";

type Color = 'white' | 'black' | string;


const IcHelp = ({ color = 'black' } : { color?: Color }) => {
   return <Image src={color === 'black' ? `icons/ic-tooltip.svg` : `icons/ic-tooltip-white.svg`} />;
};

export default IcHelp;
