'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Container, Box, Heading, Text, Button, Flex } from '@chakra-ui/react';

const OrderSuccessPage = () => {
  return (
    <Container
      maxW="container.lg"
      minH="100vh"
      bg="gray.900"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="gray.700"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
        maxW="md"
        w="100%"
      >
        <CheckCircleIcon color="green.500" boxSize="6rem" mx="auto" mb={6} />
        <Heading as="h1" size="xl" color="purple.300" fontWeight="bold" mb={4}>
          Order Placed Successfully!
        </Heading>
        <Text color="gray.300" fontSize="lg" mb={6}>
          Thank you for your purchase. Your order has been placed and will be processed shortly.
        </Text>
        <Flex direction="column" gap={4}>
          <Button
            as={Link}
            href="/shop"
            bg="purple.500"
            _hover={{ bg: 'purple.600' }}
            color="white"
            fontWeight="bold"
            py={3}
            px={6}
            borderRadius="lg"
            fontSize="lg"
          >
            Continue Shopping
          </Button>
          <Button
            as={Link}
            href="/user/profile/orders"
            bg="gray.600"
            _hover={{ bg: 'gray.700' }}
            color="gray.300"
            fontWeight="bold"
            py={3}
            px={6}
            borderRadius="lg"
            fontSize="lg"
          >
            View My Orders
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;