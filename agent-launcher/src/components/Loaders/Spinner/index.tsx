import { s } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import styles from "./styles.module.scss";
import cs from "clsx";

type Props = React.ComponentProps<"div"> & {
   color?: string;
   size?: number;
};

function Spinner({
   className,
   color = "#25b09b",
   size = 24,
   style,
   ...props
}: Props) {
   return (
      <div
         className={cs(styles.loaderBox, className)}
         style={{
            ...style,
            width: `${size}px`,
            height: `${size}px`,
         }}
         {...props}
      >
         <div
            className={styles.loaderInner}
            style={{
               transform: `scale(${size * 0.015})`,
            }}
         >
            <div
               style={{
                  color,
               }}
               className={styles.loader}
            ></div>
         </div>
      </div>
   );
}

export default Spinner;
