// SliderCard.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import styles from "./styles.module.scss";
import "swiper/css";
import "swiper/css/pagination";
import { Flex, Image } from "@chakra-ui/react";

const slides = [
   {
      title: "Vibe Everything",
      description: "Code, create, and build the way that feels right to you. No rules, just flow.",
      codeImage: "images/studio-1.png",
   },
   {
      title: "AI for Every Task",
      description: "Writing, coding, organizing—whatever you need, there’s an AI agent for that.",
      codeImage: "images/studio-3.png",
   },
   {
      title: "Your AI, Your Space",
      description: "No internet? No problem. Your AI runs locally, keeping everything private",

      codeImage: "images/studio-2.png",
   },
];

const SliderCard = () => {
   return (
      <div className={styles.container}>
         <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
               delay: 5000,
               disableOnInteraction: false,
            }}
            pagination={{
               clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className={styles.swiper}
         >
            {slides.map((slide, index) => (
               <SwiperSlide key={index}>
                  <Flex
                     flexDirection="column"
                     justifyContent="center"
                     alignItems="center"
                     height="100%"
                  >
                     <div className={styles.slideContent}>
                        <h2 className={styles.title}>{slide.title}</h2>
                        <p className={styles.description}>{slide.description}</p>
                     </div>
                     <Image
                        width="70%" maxWidth="800px" height="auto"
                        src={slide.codeImage}
                        alt={slide.codeImage}
                     />
                  </Flex>
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
};

export default SliderCard;