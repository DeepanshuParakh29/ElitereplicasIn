'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  IconButton,
  Select,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
  Stack,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useCart } from '@/context/CartContext';
import { apiGet } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';
import { Product } from '@/types';

const CartPage = () => {
  const { state: { cartItems }, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockInfo, setStockInfo] = useState<Record<string, number>>({});
  const toast = useToast();

  // Fetch latest product data to verify stock availability
  useEffect(() => {
    const fetchProductData = async () => {
      if (cartItems.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get product IDs from cart items
        const productIds = cartItems.map(item => item._id);
        
        // Fetch current product data for items in cart
        const productPromises = productIds.map(async (id) => {
          try {
            // Use the apiGet utility to fetch from the real backend API
            const response = await apiGet<{success: boolean; product: Product; message?: string}>(PRODUCT_ENDPOINTS.DETAIL(id));
            if (!response.success) {
              throw new Error(response.message || 'Failed to fetch product details');
            }
            const product = response.product;
            return product;
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            // Return the cart item as a fallback if we can't fetch the latest data
            const cartItem = cartItems.find(item => item._id === id);
            if (cartItem) {
              console.log(`Using cart item data as fallback for product ${id}`);
              return {
                ...cartItem,
                countInStock: cartItem.quantity // Assume we have at least enough stock for current quantity
              };
            }
            return null;
          }
        });
        
        const products = await Promise.all(productPromises);
        
        // Create a map of product ID to countInStock
        const stockData: Record<string, number> = {};
        products.forEach(product => {
          if (product && product._id) {
            stockData[product._id] = product.countInStock;
          }
        });
        
        setStockInfo(stockData);
        
        // Update cart items if any are out of stock or quantities exceed available stock
        cartItems.forEach(item => {
          const availableStock = stockData[item._id] || 0;
          
          // Remove item if out of stock
          if (availableStock === 0) {
            dispatch({ type: 'REMOVE_ITEM', payload: item._id });
            toast({
              title: 'Item removed',
              description: `${item.name} is no longer in stock.`,
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
          } 
          // Adjust quantity if it exceeds available stock
          else if (item.quantity > availableStock) {
            dispatch({
              type: 'UPDATE_QUANTITY',
              payload: { _id: item._id, quantity: availableStock }
            });
            toast({
              title: 'Quantity adjusted',
              description: `${item.name} quantity adjusted to match available stock.`,
              status: 'info',
              duration: 5000,
              isClosable: true,
            });
          }
        });
        
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Unable to verify product availability. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [cartItems.map(item => item._id).join(','), dispatch, toast]);

  const removeItemFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your cart.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const updateItemQty = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { _id: id, quantity }
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Updating your cart...</Text>
        </VStack>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          colorScheme="brand"
          size="md"
          mt={4}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Heading>Your Cart is Empty</Heading>
          <Text>Add some items to your cart to see them here.</Text>
          <Button
            as={Link}
            href="/shop"
            colorScheme="brand"
            size="lg"
          >
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Shopping Cart</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box gridColumn="span 2">
            <VStack spacing={4} align="stretch">
              {cartItems.map((item) => (
                <Card key={item._id}>
                  <CardBody>
                    <Flex gap={4}>
                      <Box position="relative" width="100px" height="100px">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      
                      <Stack flex={1} spacing={4}>
                        <Box>
                          <Heading size="md">{item.name}</Heading>
                          <Text color="brand.500" fontSize="xl" fontWeight="bold">
                            ${item.price.toFixed(2)}
                          </Text>
                        </Box>
                        
                        <HStack justify="space-between">
                          <Select
                            value={item.quantity}
                            onChange={(e) => updateItemQty(item._id, parseInt(e.target.value))}
                            width="100px"
                          >
                            {[...Array(stockInfo[item._id] || item.countInStock)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </Select>
                          
                          <IconButton
                            aria-label="Remove item"
                            icon={<DeleteIcon />}
                            onClick={() => removeItemFromCart(item._id)}
                            colorScheme="red"
                            variant="ghost"
                          />
                        </HStack>
                      </Stack>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          <Box>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Order Summary</Heading>
                  <Divider />
                  <HStack justify="space-between">
                    <Text>Subtotal</Text>
                    <Text fontWeight="bold">${calculateTotal().toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Shipping</Text>
                    <Text fontWeight="bold">Calculated at checkout</Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total</Text>
                    <Text fontSize="xl" fontWeight="bold" color="brand.500">
                      ${calculateTotal().toFixed(2)}
                    </Text>
                  </HStack>
                  <Button
                    as={Link}
                    href="/checkout"
                    colorScheme="brand"
                    size="lg"
                    isDisabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default CartPage;
