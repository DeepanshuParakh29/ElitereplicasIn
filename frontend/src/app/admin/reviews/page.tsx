'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Flex, Spacer, Badge, useToast } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching review data
    const fetchReviews = () => {
      const dummyReviews: Review[] = [
        {
          id: 'rev_001',
          productId: 'prod_001',
          productName: 'Elite Gaming Mouse',
          userId: 'user_001',
          userName: 'Alice Smith',
          rating: 5,
          comment: 'Absolutely love this mouse! Very precise and comfortable.',
          status: 'pending',
          createdAt: '2023-01-15T10:00:00Z',
        },
        {
          id: 'rev_002',
          productId: 'prod_002',
          productName: 'Mechanical Keyboard Pro',
          userId: 'user_002',
          userName: 'Bob Johnson',
          rating: 4,
          comment: 'Great keyboard, but the keys are a bit loud.',
          status: 'approved',
          createdAt: '2023-01-16T11:30:00Z',
        },
        {
          id: 'rev_003',
          productId: 'prod_001',
          productName: 'Elite Gaming Mouse',
          userId: 'user_003',
          userName: 'Charlie Brown',
          rating: 2,
          comment: 'Mouse stopped working after a week. Very disappointed.',
          status: 'pending',
          createdAt: '2023-01-17T14:00:00Z',
        },
        {
          id: 'rev_004',
          productId: 'prod_003',
          productName: 'Ultra-Wide Monitor',
          userId: 'user_004',
          userName: 'Diana Prince',
          rating: 5,
          comment: 'Stunning display and perfect for multitasking!',
          status: 'approved',
          createdAt: '2023-01-18T09:00:00Z',
        },
      ];
      setReviews(dummyReviews);
      setLoading(false);
      // setError('Failed to load reviews.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchReviews();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      )
    );
    toast({
      title: `Review ${newStatus}`,
      description: `Review ID: ${id} has been ${newStatus}.`,
      status: newStatus === 'approved' ? 'success' : 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading reviews...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Alert status="error" bg="orange.100" color="orange.800">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Flex mb={8} alignItems="center">
        <Heading as="h1" size="xl" color="purple.400">Customer Reviews</Heading>
        <Spacer />
      </Flex>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        {reviews.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Product</Th>
                  <Th color="gray.300">User</Th>
                  <Th color="gray.300" isNumeric>Rating</Th>
                  <Th color="gray.300">Comment</Th>
                  <Th color="gray.300">Status</Th>
                  <Th color="gray.300">Date</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reviews.map((review) => (
                  <Tr key={review.id}>
                    <Td>{review.productName}</Td>
                    <Td>{review.userName}</Td>
                    <Td isNumeric>{review.rating} / 5</Td>
                    <Td maxW="300px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{review.comment}</Td>
                    <Td>
                      <Badge colorScheme={review.status === 'approved' ? 'green' : review.status === 'pending' ? 'yellow' : 'red'}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                    </Td>
                    <Td>{new Date(review.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      {review.status === 'pending' && (
                        <Flex>
                          <Button size="sm" leftIcon={<FaCheckCircle />} colorScheme="green" mr={2} onClick={() => handleStatusChange(review.id, 'approved')}>
                            Approve
                          </Button>
                          <Button size="sm" leftIcon={<FaTimesCircle />} colorScheme="red" onClick={() => handleStatusChange(review.id, 'rejected')}>
                            Reject
                          </Button>
                        </Flex>
                      )}
                      {review.status !== 'pending' && (
                        <Text fontSize="sm" color="gray.500">No actions</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No reviews found.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default AdminReviewsPage;