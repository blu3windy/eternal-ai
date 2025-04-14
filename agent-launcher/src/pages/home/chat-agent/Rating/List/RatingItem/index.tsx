import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import styles from './styles.module.scss';

interface RatingItemProps {
  rating: number;
  comment: string;
  username: string;
  date: string;
}

const RatingItem: React.FC<RatingItemProps> = ({
  rating,
  comment,
  username,
  date,
}) => {
  return (
    <Box className={styles.ratingItem}>
      <HStack spacing={2} mb={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            color={index < rating ? 'yellow.400' : 'gray.300'}
            boxSize={4}
          />
        ))}
      </HStack>
      
      <Text className={styles.comment} mb={3}>
        {comment}
      </Text>
      
      <HStack className={styles.footer} justify="space-between">
        <Text className={styles.username}>{username}</Text>
        <Text className={styles.date}>{date}</Text>
      </HStack>
    </Box>
  );
};

export default RatingItem; 