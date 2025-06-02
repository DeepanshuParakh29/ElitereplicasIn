'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  HStack,
  Avatar,
  useToast,
  Select,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { apiPost } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface ProductReviewSectionProps {
  productId: string;
  reviews: Review[];
  isLoggedIn: boolean;
}

const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  productId,
  reviews = [],
  isLoggedIn = false,
}) => {
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const dateColor = useColorModeValue('gray.500', 'gray.400');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a review',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!userReview.comment.trim()) {
      toast({
        title: 'Review required',
        description: 'Please write your review before submitting',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiPost<{
        success: boolean;
        message: string;
        review?: Review;
      }>(PRODUCT_ENDPOINTS.ADD_REVIEW(productId), userReview);

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setUserReview({
        rating: 5,
        comment: '',
      });

      // Refresh the page to show the new review
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    return (
      <HStack spacing={1}>
        {[...Array(5)].map((_, i) => (
          <Box key={i} color={i < rating ? 'yellow.400' : 'gray.300'}>
            <FaStar />
          </Box>
        ))}
      </HStack>
    );
  };

  return (
    <Box mt={10}>
      <Heading as="h3" size="lg" mb={6} color={headingColor}>
        Customer Reviews
      </Heading>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <VStack spacing={4} align="stretch" mb={8}>
          {reviews.map((review) => (
            <Box 
              key={review._id} 
              p={4} 
              bg={bgColor} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor={borderColor}
              shadow="sm"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <HStack>
                  <Avatar size="sm" name={review.name} />
                  <Text fontWeight="bold" color={textColor}>
                    {review.name}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={dateColor}>
                  {formatDate(review.createdAt)}
                </Text>
              </Flex>
              
              {renderStars(review.rating)}
              
              <Text mt={3} color={textColor}>
                {review.comment}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box 
          p={4} 
          bg={bgColor} 
          borderRadius="md" 
          borderWidth="1px" 
          borderColor={borderColor}
          mb={8}
          textAlign="center"
        >
          <Text color={textColor}>No reviews yet. Be the first to review this product!</Text>
        </Box>
      )}

      {/* Review Form */}
      <Box 
        p={6} 
        bg={bgColor} 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={borderColor}
        shadow="md"
      >
        <Heading as="h4" size="md" mb={4} color={headingColor}>
          Write a Review
        </Heading>
        
        {!isLoggedIn && (
          <Text color="orange.500" mb={4}>
            Please log in to leave a review.
          </Text>
        )}
        
        <form onSubmit={handleSubmitReview}>
          <Stack spacing={4}>
            <FormControl id="rating">
              <FormLabel>Rating</FormLabel>
              <Select 
                name="rating" 
                value={userReview.rating} 
                onChange={handleInputChange}
                isDisabled={!isLoggedIn || isSubmitting}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </Select>
            </FormControl>
            
            <FormControl id="comment">
              <FormLabel>Your Review</FormLabel>
              <Textarea
                name="comment"
                value={userReview.comment}
                onChange={handleInputChange}
                placeholder="Share your experience with this product..."
                size="md"
                isDisabled={!isLoggedIn || isSubmitting}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting}
              isDisabled={!isLoggedIn || isSubmitting}
              mt={2}
            >
              Submit Review
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default ProductReviewSection;