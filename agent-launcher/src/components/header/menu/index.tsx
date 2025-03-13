import {
   Box,
   Flex,
   Image,
   Link,
   Popover,
   PopoverArrow,
   PopoverBody,
   PopoverContent,
   PopoverTrigger,
   Text,
} from "@chakra-ui/react";
import cs from "clsx";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS, NavItem } from "./menuConfig.ts";
import s from "./styles.module.scss";

type Props = {
  primaryColor?: "black" | "white";
  listNavItems?: Array<NavItem>;
};

const HeaderMenu = (props: Props) => {
   const location = useLocation();
   const pathName = location.pathname;
   console.log("stephen: pathname", pathName);

   return (
      <Flex
         className={s.deskMenu}
         style={{ "--color": props.primaryColor || "white" } as any}
      >
         {NAV_ITEMS?.map((navItem) => {
            return (
               <Link
                  className={cs(
                     navItem.rootHref
                        ? pathName.includes(navItem.rootHref)
                           ? s.isActive
                           : ""
                        : pathName === navItem.href
                           ? s.isActive
                           : "",
                     s[props?.primaryColor || "white"]
                  )}
                  key={navItem.label}
                  href={navItem.href ?? "#"}
                  target={navItem.isNewWindow ? "_blank" : "_self"}
                  color={props?.primaryColor || "white"}
               >
                  <Box className={cs(s.borderLeft, s[navItem.className as any])} />
                  <Image src={navItem.icon} />
               </Link>
            );
         })}
      </Flex>
   );
};

export default HeaderMenu;
