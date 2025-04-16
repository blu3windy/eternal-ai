import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Box, Textarea, Text, IconButton, Flex } from '@chakra-ui/react';
import * as Yup from 'yup';
import StarIcon from './StarIcon';
import styles from './styles.module.scss';
import BaseButton from '@components/BaseButton';

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
               <Flex direction="column" gap="16px">
                  <Flex gap="24px" alignItems="center">
                     <Text className={styles.title}>
                        Rate
                     </Text>
                     <Box className={styles.starContainer}>
                        {Array.from({ length: 5 }, (_, index) => (
                           <Box key={index} className={styles.starButton} onClick={() => setFieldValue('rating', index + 1)}>
                              <StarIcon isActive={index + 1 <= values.rating} />
                           </Box>
                        ))}
                     </Box>
                  </Flex>
                  {touched.rating && errors.rating && (
                     <Text className={styles.errorText}>{errors.rating}</Text>
                  )}
               </Flex>
               <Flex gap="24px" width="100%">
                  <Text className={styles.title}>
                    Comment
                  </Text>
                  <Field name="comment" width="100%">
                     {({ field }: any) => (
                        <Box className={styles.commentField}>
                           <Textarea
                              {...field}
                              placeholder="Add your comments here..."
                              maxLength={400}
                              rows={4}
                           />
                           <Flex justifyContent="space-between" marginTop="6px">
                              {(touched.comment && errors.comment) ? (
                                 <Text className={styles.errorText}>{errors.comment}</Text>
                              ) : <></>}
                              <Text className={styles.charCount}>
                                 {field.value.length}/400 characters
                              </Text>
                    
                           </Flex>
                        </Box>
                     )}
                  </Field>
               </Flex>
               <BaseButton
                  type="submit"
                  height="48px"
                  width="fit-content"
                  maxWidth="180px"
                  margin="0 0 0 auto"
                  marginTop="32px"
               >
                  Submit
               </BaseButton>
            </Form>
         )}
      </Formik>
   );
};

export default RatingForm; 