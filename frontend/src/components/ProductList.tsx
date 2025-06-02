'use client';

import React from 'react';
import { SimpleGrid, Box, Text, Spinner, Center, Heading, Button, Flex } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  sku?: string;
  stock?: number;
}

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  emptyMessage?: string;
  isCompact?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
  columns?: { base: number; sm: number; md: number; lg: number; xl: number };
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading = false,
  error = null,
  title,
  emptyMessage = 'No products found.',
  isCompact = false,
  showViewAll = false,
  viewAllLink = '/shop',
  columns = { base: 1, sm: 2, md: 3, lg: 4, xl: 5 }, // Changed xl to 5 to match the error message's expectation of a missing 'xl' property and provide a distinct value.
}) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="purple.500" thickness="4px" speed="0.65s" />
        <Text ml={4} fontSize="lg">Loading products...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500" fontSize="lg">Error: {error}</Text>
      </Center>
    );
  }

  return (
    <Box>
      {title && (
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="xl" fontWeight="bold">
            {title}
          </Heading>
          {showViewAll && products.length > 0 && (
            <Button
              as={Link}
              href={viewAllLink}
              colorScheme="purple"
              variant="outline"
            >
              View All
            </Button>
          )}
        </Flex>
      )}
      {products.length > 0 ? (
        <SimpleGrid columns={columns} spacing={6} mb={8}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} isCompact={isCompact} />
          ))}
        </SimpleGrid>
      ) : (
        <Center py={10}>
          <Text fontSize="lg">{emptyMessage}</Text>
        </Center>
      )}
    </Box>
  );
};

export default ProductList;