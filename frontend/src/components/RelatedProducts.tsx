'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Text,
  Center,
} from '@chakra-ui/react';
import ProductCard from './ProductCard';
import { apiGet } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';

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
}

interface RelatedProductsProps {
  productId: string;
  category: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  productId, 
  category, 
  limit = 4 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const data = await apiGet<{products: Product[], success: boolean}>(PRODUCT_ENDPOINTS.BY_CATEGORY(category), { limit: limit.toString() });
        
        if (!data.success) {
          throw new Error('Failed to fetch related products');
        }
        
        // Filter out the current product and limit to specified number
        const filteredProducts = data.products.filter(
          (product: Product) => product._id !== productId
        ).slice(0, limit);
        
        setProducts(filteredProducts);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, limit, productId]);

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500">Error loading related products: {error}</Text>
      </Center>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if there are no related products
  }

  return (
    <Box py={8} bg={bgColor} borderRadius="lg">
      <Heading as="h3" size="lg" mb={6} color={headingColor}>
        Related Products
      </Heading>
      
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            isCompact={true}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RelatedProducts;