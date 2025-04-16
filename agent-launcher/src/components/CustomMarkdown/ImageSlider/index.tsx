import { CustomComponentProps } from "../types";
import Slider from "react-slick";
import styles from './styles.module.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";
import useInViewportOnce from "@hooks/useInViewportOnce";

type Props = React.ComponentPropsWithRef<'div'> & CustomComponentProps;

function ImageSlider({ node, children, ...props }: Props) {
   const { ref, inViewport } = useInViewportOnce();

   const images = useMemo(() => {
      return (children as any[])
         .filter(item => typeof item !== 'string')
         .map(item => item?.props?.children?.props?.src?.trim()) as string[];
   }, [children]);

   const settings = useMemo(() => ({
      customPaging: function(i) {
         return (
            <div className={styles.thumbnail}>
               {!!inViewport && (<img loading="lazy" alt="" src={images[i]} />)}
            </div>
         );
      },
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: styles.dots,
   }), [images, inViewport]);

   return (
      <div ref={ref} className={styles.imageSlider}>
         <div className={styles.container}>
            {!!inViewport && (
               <Slider {...settings} className={styles.sliderSlicker}>
                  {images.map((item, index) => 
                     <div className={styles.slideItem} key={`${item}-${index}`}>
                        <div className={styles.box}>
                           <img src={item} alt="" loading="lazy" />
                        </div>
                     </div>
                  )}
               </Slider>
            )}
         </div>
      </div>
   );
}

export default ImageSlider;
