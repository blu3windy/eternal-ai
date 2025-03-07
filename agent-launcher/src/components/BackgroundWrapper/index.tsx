import { FC, PropsWithChildren } from "react";
import { Flex, Grid, Image, Box, GridProps } from "@chakra-ui/react";

interface IProps extends PropsWithChildren {
    className?: string;
    style?: GridProps;
}

const BackgroundWrapper = ({ children, className, style }: IProps) => {
   return (
      <Grid
         backgroundColor="white"
         width="100dvw"
         height="100dvh"
         flexDirection="column"
         gap="24px"
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
            display={{
               base: "none",
               xl: "block",
            }}
         >
            <Image
               src="images/bg-main.png"
               alt="bg-main"
               width="100%"
               height="100%"
               objectFit="cover" // Ensures it fills available space
               maxW="none" // Prevents automatic shrinking
            />
         </Box>
      </Grid>
   );
};

export default BackgroundWrapper;