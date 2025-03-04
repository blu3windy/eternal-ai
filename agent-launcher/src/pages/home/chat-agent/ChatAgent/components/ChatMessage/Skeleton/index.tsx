import s from "./styles.module.scss";
import { SkeletonAvatar, SkeletonLongText, SkeletonShortText } from "@components/Common";

interface props {
  amount: number;
}

const NORMAL_STYLE = {};

const Skeleton = ({ amount }: props) => {
   const renderSkeletonItems = () => {
      const skeletonItems: any[] = [];
      for (let i = 0; i < amount; i++) {
         skeletonItems.push(
            <div className={s.item} key={i} style={NORMAL_STYLE}>
               <div className={s.avatar}>
                  <SkeletonAvatar />
               </div>
               <div className={s.info}>
                  <div className={s.name}>
                     <SkeletonShortText />
                  </div>
                  <div className={s.des}>
                     <SkeletonLongText />
                  </div>
               </div>
            </div>
         );
      }
      return skeletonItems;
   };

   return <div className={s.skeletonWrapper}>{renderSkeletonItems()}</div>;
};
export default Skeleton;
