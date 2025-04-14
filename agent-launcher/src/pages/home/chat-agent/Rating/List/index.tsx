import { StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RatingItem from './RatingItem';
import styles from './styles.module.scss';

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
}

const RatingList: React.FC<RatingListProps> = ({
  averageRating,
  totalRatings,
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
    <Box className={styles.ratingListContainer}>
      <Flex className={styles.header}>
        <Box className={styles.averageRating}>
          <Text fontSize="4xl" fontWeight="bold">
            {averageRating.toFixed(1)}
          </Text>
          <Text fontSize="md" color="gray.500">
            out of 5
          </Text>
        </Box>

        <Box className={styles.ratingStats}>
          <Text fontSize="md" color="gray.500" mb={2}>
            {totalRatings} Ratings
          </Text>
          <Box>
            {[5, 4, 3, 2, 1].map((num) => (
              <HStack key={num} spacing={2} mb={1}>
                <HStack spacing={1}>
                  {Array.from({ length: num }).map((_, idx) => (
                    <StarIcon key={idx} color="yellow.400" boxSize={3} />
                  ))}
                </HStack>
                <Box
                  className={styles.ratingBar}
                  width="200px"
                  height="8px"
                  bg="gray.200"
                  borderRadius="full"
                >
                  <Box
                    height="100%"
                    bg="yellow.400"
                    borderRadius="full"
                    width={`${
                      (ratings.filter((r) => Math.round(r.rating) === num).length /
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
        className={styles.ratingsList}
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
