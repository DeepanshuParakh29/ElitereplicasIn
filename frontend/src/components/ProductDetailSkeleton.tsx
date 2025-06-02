'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
  Stack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

const ProductDetailSkeleton: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box minH="100vh" py={8} bg={bgColor}>
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Product Image Skeleton */}
          <GridItem>
            <Skeleton 
              height="400px" 
              borderRadius="lg" 
              startColor={useColorModeValue('gray.100', 'gray.700')} 
              endColor={useColorModeValue('gray.300', 'gray.500')}
            />
          </GridItem>

          {/* Product Details Skeleton */}
          <GridItem>
            <Box p={6} bg={cardBg} borderRadius="lg" shadow="md">
              <Stack spacing={6}>
                {/* Product Title */}
                <Skeleton height="40px" width="80%" />

                {/* Rating */}
                <Flex align="center">
                  <Skeleton height="20px" width="120px" />
                  <Skeleton height="20px" width="80px" ml={2} />
                </Flex>

                {/* Price */}
                <Skeleton height="30px" width="150px" />

                {/* Description */}
                <SkeletonText noOfLines={4} spacing={4} />

                {/* Product Metadata */}
                <Stack spacing={3}>
                  <Flex justify="space-between">
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="20px" width="150px" />
                  </Flex>
                  <Flex justify="space-between">
                    <Skeleton height="20px" width="120px" />
                    <Skeleton height="20px" width="130px" />
                  </Flex>
                  <Flex justify="space-between">
                    <Skeleton height="20px" width="140px" />
                    <Skeleton height="20px" width="110px" />
                  </Flex>
                </Stack>

                {/* Add to Cart Button */}
                <Skeleton height="50px" borderRadius="full" />

                {/* Back to Shop Link */}
                <Flex justify="center" mt={4}>
                  <Skeleton height="20px" width="120px" />
                </Flex>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailSkeleton;