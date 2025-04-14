import { CustomComponentProps } from "../types";
import Slider from "react-slick";
import styles from './styles.module.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";

type Props = React.ComponentPropsWithRef<'div'> & CustomComponentProps;

function ImageSlider({ node, children, ...props }: Props) {
   const images = useMemo(() => {
      return (children as any[]).map(item => item?.props?.children?.props?.src) as string[];
   }, [children]);

   const settings = useMemo(() => ({
      customPaging: function(i) {
         return (
            <div className={styles.thumbnail}>
               <img alt="" src={images[i]} />
            </div>
         );
      },
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: styles.dots,
   }), [images]);

   return (
      <div className={styles.imageSlider}>
         <Slider {...settings}>
            {images.map((item, index) => 
               <div className={styles.slideItem} key={`${item}-${index}`} {...props}>
                  <div className={styles.box}>
                     <img src={item} alt="" />
                  </div>
               </div>
            )}
         </Slider>
      </div>
   );
}

export default ImageSlider;
