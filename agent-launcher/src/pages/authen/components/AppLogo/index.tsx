import { Image, ImageProps } from "@chakra-ui/react";

interface AppLogoProps extends ImageProps{
    src?: string;
    width?: string;
    height?: string;
}

const AppLogo = ({
   src = "icons/app-logo.png",
   width = "100px",
   height = "100px",
   ...rest
}: AppLogoProps) => {
   return <Image src={src} width={width} height={height} alt="App Logo" {...rest} />;
};

export default AppLogo;