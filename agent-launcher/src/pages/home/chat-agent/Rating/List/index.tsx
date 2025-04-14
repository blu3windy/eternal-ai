import { StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RatingItem from './RatingItem';
import s from './styles.module.scss';
import cx from 'classnames';
import { labelAmountOrNumberAdds } from '@utils/format';

interface Rating {
  id: string;
  rating: number;
  comment: string;
  username: string;
  date: string;
}

interface RatingListProps {
  averageRating: number;
  totalRatings: number;
  isShowFull?: boolean;
  theme?: 'light' | 'dark';
}

const RatingList: React.FC<RatingListProps> = ({
  averageRating,
  totalRatings,
  isShowFull = false,
  theme = 'light',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRatings = async () => {
    const newRatings = await fetchMoreRatings();
    setRatings([...ratings, ...newRatings]);

    setHasMore(newRatings.length > 0);
  };

  return (
    <Box className={cx(s.ratingListContainer, { [s.dark]: theme === 'dark', })}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Text className={s.title}>Ratings & Reviews</Text>
        <Text className={s.viewAll}>See All</Text>
      </Flex>

      <Flex className={s.header} gap={'40px'}>
        <Flex justifyContent={'space-between'} alignItems={'flex-end'} flex={1} gap={'8px'}>
          <Flex className={s.averageRating} gap={'8px'}>
            <Text fontSize="60px" fontWeight="700" lineHeight={'60px'}>
              {averageRating.toFixed(1)}
            </Text>
            <Text fontSize="16px" fontWeight="600">
              out of 5
            </Text>
          </Flex>
          <Text fontSize="16px" fontWeight="400" opacity={0.8} className={s.totalRatings}>
            {totalRatings} Rating{labelAmountOrNumberAdds(totalRatings)}
          </Text>
        </Flex>

        <Box className={s.ratingStats} flex={1}>
          <Box>
            {[5, 4, 3, 2, 1].map((num) => (
              <HStack key={num} spacing={'12px'} mb={'4px'}>
                <HStack spacing={1} minW={'80px'} justifyContent={'flex-end'}>
                  {Array.from({ length: num }).map((_, idx) => (
                    <StarIcon key={idx} color={theme === 'dark' ? 'white' : 'black'} boxSize={3} />
                  ))}
                </HStack>
                <Box
                  className={s.ratingBar}
                  width="100%"
                  height="4px"
                  bg="#00000033"
                  borderRadius="full"
                >
                  <Box
                    height="100%"
                    bg={theme === 'dark' ? 'white' : 'black'}
                    borderRadius="full"
                    width={`${(ratings.filter((r) => Math.round(r.rating) === num).length /
                        totalRatings) *
                      100
                      }%`}
                  />
                </Box>
              </HStack>
            ))}
          </Box>
        </Box>
      </Flex>

      <Box
        id="scrollableRatings"
        className={s.ratingsList}
        ref={scrollContainerRef}
      >
        <InfiniteScroll
          dataLength={ratings.length}
          next={loadMoreRatings}
          hasMore={hasMore}
          loader={<div>Loading...</div>}
          scrollableTarget="scrollableRatings"
          style={{ display: 'flex', overflow: 'hidden' }}
          scrollThreshold={0.9}
        >
          {ratings.map((rating) => (
            <RatingItem
              key={rating.id}
              rating={rating.rating}
              comment={rating.comment}
              username={rating.username}
              date={rating.date}
            />
          ))}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default RatingList;

function fetchMoreRatings() {
  throw new Error('Function not implemented.');
}
