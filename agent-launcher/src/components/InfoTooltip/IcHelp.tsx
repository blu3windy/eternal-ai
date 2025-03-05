import { Image } from "@chakra-ui/react";

const IcHelp = ({color = 'black'} : {color: 'white' | 'black'}) => {
   return <Image src={color === 'black' ? `/icons/ic-tooltip.svg` : `/icons/ic-tooltip-white.svg`} />;
};

export default IcHelp;
