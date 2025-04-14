import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Box, Textarea, Text, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import * as Yup from 'yup';
import styles from './styles.module.scss';

interface RatingFormValues {
  rating: number;
  comment: string;
}

interface RatingFormProps {
  onClose: () => void;
  initialValues?: RatingFormValues;
}

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Please select a rating')
    .required('Rating is required'),
  comment: Yup.string()
    .max(400, 'Comment must be at most 400 characters')
    .required('Comment is required'),
});

const RatingForm: React.FC<RatingFormProps> = ({ 
  onClose,
  initialValues = { rating: 0, comment: '' } 
}) => {

  const onSubmit = (values: RatingFormValues) => {
    console.log('values', values);
    onClose();
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className={styles.ratingForm}>
          <Text className={styles.title}>
            Rate your experience
          </Text>
          
          <Box className={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                aria-label={`Rate ${star} stars`}
                icon={<StarIcon />}
                onClick={() => setFieldValue('rating', star)}
                className={`${styles.starButton} ${
                  star <= values.rating ? styles.active : styles.inactive
                }`}
                variant="ghost"
                size="lg"
              />
            ))}
          </Box>
          {touched.rating && errors.rating && (
            <Text className={styles.errorText}>{errors.rating}</Text>
          )}

          <Field name="comment">
            {({ field }: any) => (
              <Box className={styles.commentField}>
                <Textarea
                  {...field}
                  placeholder="Add your comments here..."
                  maxLength={400}
                  rows={4}
                />
                <Text className={styles.charCount}>
                  {field.value.length}/400 characters
                </Text>
                {touched.comment && errors.comment && (
                  <Text className={styles.errorText}>{errors.comment}</Text>
                )}
              </Box>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default RatingForm; 