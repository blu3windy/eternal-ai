import {BASE_COLOR, HIGHLIGHT_COLOR} from "@constants/skeleton.ts";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonShortText = () => {
  return (
    <Skeleton
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
      width="120px"
    />
  );
};

export default SkeletonShortText;
