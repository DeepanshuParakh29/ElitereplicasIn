'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { apiPost } from '@/utils/api';
import { ADMIN_ENDPOINTS } from '@/config/api';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';

const ProductCreatePage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const { isAuthenticated } = useAuth();

  const product = {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await apiPost<{ success: boolean; product: any; message?: string }>(ADMIN_ENDPOINTS.PRODUCTS, product);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create product');
      }

      toast({
        title: 'Product created.',
        description: 'Product has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast({
        title: 'Creation failed.',
        description: `Failed to create product: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={4} minH="100vh" bg="gray.900" color="white">
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
        Create Product
      </Heading>
      <Box p={6} bg="gray.700" borderRadius="lg" shadow="xl">
        <VStack as="form" spacing={4} onSubmit={submitHandler}>
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            placeholder="Count In Stock"
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            required
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Input
            as="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            bg="gray.800"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'purple.500', bg: 'gray.600' }}
          />

          <Box display="flex" justifyContent="space-between" w="full" mt={4}>
            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              px={8}
              borderRadius="full"
            >
              Create Product
            </Button>
            <NextLink href="/admin/products" passHref legacyBehavior>
              <Button
                as="a"
                variant="outline"
                colorScheme="purple"
                size="lg"
                px={8}
                borderRadius="full"
              >
                Cancel
              </Button>
            </NextLink>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default ProductCreatePage;