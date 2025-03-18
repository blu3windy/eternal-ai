import React, { useCallback, useState } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isUploading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isUploading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor={isDragActive ? "blue.500" : "gray.200"}
      borderRadius="md"
      p={4}
      textAlign="center"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ borderColor: 'blue.500' }}
      bg={isDragActive ? 'gray.50' : 'white'}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the image here...</Text>
      ) : (
        <Text>Drag & drop an image here, or click to select</Text>
      )}
      {isUploading && <Text mt={2}>Uploading...</Text>}
    </Box>
  );
};

export default ImageUpload; 