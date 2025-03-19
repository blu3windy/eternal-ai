import { PropsWithChildren } from "react";
import { Grid, Box, GridProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import SliderCard from "./SliderCard";

interface IProps extends PropsWithChildren {
    className?: string;
    style?: GridProps;
    showSlider?: boolean;
}

const BackgroundWrapper = ({ children, className, style, showSlider = false }: IProps) => {
   return (
      <Grid
         backgroundColor="white"
         width="100dvw"
         height="100dvh"
         flexDirection="column"
         gap="24px"
         as={motion.div}
         className={className || ""}
         gridTemplateColumns={{
            base: "1fr",
            xl: "1fr 1fr",
         }}
         {...style}
      >
         {children}

         {/* Wrapper for Image to control scrolling */}
         <Box
            flex={1}
            overflow="auto"
            width="100%"
            height="100%"
            display={{
               base: "none",
               xl: "block",
            }}
            backgroundImage="images/bg-main.png"
            backgroundSize="cover"
            backgroundPosition="center"
         >
            {showSlider && (
               <SliderCard />
            )}
         </Box>
      </Grid>
   );
};

export default BackgroundWrapper;