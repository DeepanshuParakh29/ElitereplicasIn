'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Container, Box, Heading, Input, Button, VStack, FormControl, FormLabel, Textarea, Spinner, Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { apiGet, apiPut } from '@/utils/api';
import { ADMIN_ENDPOINTS } from '@/config/api';

const ProductEditPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiGet<{ success: boolean; product: any; message?: string }>(ADMIN_ENDPOINTS.PRODUCT_DETAIL(productId as string));
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch product');
        }
        setName(data.product.name);
        setPrice(data.product.price);
        setImage(data.product.image);
        setBrand(data.product.brand);
        setCategory(data.product.category);
        setCountInStock(data.product.countInStock);
        setDescription(data.product.description);
      } catch (err: any) {
        setError(err);
        toast({
          title: 'Error fetching product.',
          description: err.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiPut<{ success: boolean; product: any; message?: string }>(ADMIN_ENDPOINTS.PRODUCT_DETAIL(productId as string), {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update product');
      }

      toast({
        title: 'Product updated.',
        description: 'Product has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast({
        title: 'Failed to update product.',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="#1a202c" color="#fff">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading product data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="#1a202c" color="#fff">
        <Text color="red.500" fontSize="xl">Error: {error.message}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={4} minH="100vh" bg="#1a202c" color="#fff">
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
        Edit Product
      </Heading>

      <Box p={6} bg="#2d3748" borderRadius="lg" shadow="xl">
        <VStack as="form" spacing={4} onSubmit={submitHandler}>
          <FormControl id="name" isRequired>
            <FormLabel color="gray.300">Product Name</FormLabel>
            <Input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="price" isRequired>
            <FormLabel color="gray.300">Price</FormLabel>
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="image" isRequired>
            <FormLabel color="gray.300">Image URL</FormLabel>
            <Input
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="brand" isRequired>
            <FormLabel color="gray.300">Brand</FormLabel>
            <Input
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="category" isRequired>
            <FormLabel color="gray.300">Category</FormLabel>
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="countInStock" isRequired>
            <FormLabel color="gray.300">Count In Stock</FormLabel>
            <Input
              type="number"
              placeholder="Count In Stock"
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel color="gray.300">Description</FormLabel>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #a78bfa' }}
              color="white"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            width="full"
            _hover={{ bg: 'purple.500' }}
          >
            Update Product
          </Button>
          <Button
            as={Link}
            href="/admin/products"
            variant="outline"
            colorScheme="purple"
            size="lg"
            width="full"
            _hover={{ bg: 'purple.500', color: 'white' }}
          >
            Go Back
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ProductEditPage;