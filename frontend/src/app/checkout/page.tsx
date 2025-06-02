'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Heading, Text, Box, Grid, Input, RadioGroup, Radio, Button, Flex, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';
import { useCart } from '@/context/CartContext';
import { apiPost } from '@/utils/api';
import { ORDER_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

const CheckoutPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { state: { cartItems }, dispatch } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to proceed with checkout',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      router.push('/login?redirect=checkout');
    }
    
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: 'Empty cart',
        description: 'Your cart is empty. Add some items before checkout.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      router.push('/cart');
    }
  }, [isAuthenticated, cartItems, router]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to proceed with checkout',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      router.push('/login?redirect=checkout');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice
      };
      
      // Send order to backend
      const response = await apiPost<{success: boolean; order: any; message?: string}>(ORDER_ENDPOINTS.CREATE, orderData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create order');
      }
      
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      
      toast({
        title: 'Order placed successfully',
        description: `Order ID: ${response.order._id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to order success page
      router.push(`/order-success?id=${response.order._id}`);
    } catch (error: any) {
      toast({
        title: 'Order failed',
        description: error.message || 'An error occurred while placing your order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate prices from actual cart items
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over $1000
  const taxPrice = itemsPrice * 0.15; // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <Box bg="gray.900" color="white" py={8} minH="100vh">
      <Flex direction={{ base: 'column', lg: 'row' }} maxW="container.lg" mx="auto" px={4} gap={8}>
        {/* Shipping and Payment Form */}
        <Box flex={1} bg="gray.700" p={8} borderRadius="lg" boxShadow="xl">
          <Heading as="h1" size="xl" color="purple.300" fontWeight="bold" mb={6}>
            Checkout
          </Heading>

          <Box as="form" onSubmit={submitHandler}>
            <Heading as="h2" size="md" color="gray.300" mb={4}>
              Shipping Address
            </Heading>
            <VStack spacing={4}>
              <FormControl id="address">
                <FormLabel color="gray.400">Address</FormLabel>
                <Input
                  placeholder="Enter address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  required
                  borderColor="gray.600"
                  _hover={{ borderColor: 'purple.300' }}
                  _focus={{ borderColor: 'purple.300', boxShadow: '0 0 0 1px purple.300' }}
                  color="white"
                />
              </FormControl>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} w="full">
                <FormControl id="city">
                  <FormLabel color="gray.400">City</FormLabel>
                  <Input
                    placeholder="Enter city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    required
                    borderColor="gray.600"
                    _hover={{ borderColor: 'purple.300' }}
                    _focus={{ borderColor: 'purple.300', boxShadow: '0 0 0 1px purple.300' }}
                    color="white"
                  />
                </FormControl>
                <FormControl id="postalCode">
                  <FormLabel color="gray.400">Postal Code</FormLabel>
                  <Input
                    placeholder="Enter postal code"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    required
                    borderColor="gray.600"
                    _hover={{ borderColor: 'purple.300' }}
                    _focus={{ borderColor: 'purple.300', boxShadow: '0 0 0 1px purple.300' }}
                    color="white"
                  />
                </FormControl>
                <FormControl id="country">
                  <FormLabel color="gray.400">Country</FormLabel>
                  <Input
                    placeholder="Enter country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleShippingChange}
                    required
                    borderColor="gray.600"
                    _hover={{ borderColor: 'purple.300' }}
                    _focus={{ borderColor: 'purple.300', boxShadow: '0 0 0 1px purple.300' }}
                    color="white"
                  />
                </FormControl>
              </Grid>
            </VStack>

            <Heading as="h2" size="md" color="gray.300" mt={8} mb={4}>
              Payment Method
            </Heading>
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <VStack align="flex-start">
                <Radio value="paypal" colorScheme="purple">
                  <Text color="white">PayPal or Credit Card</Text>
                </Radio>
                {/* Add more payment options if needed */}
              </VStack>
            </RadioGroup>

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              width="full"
              mt={8}
              py={3}
              fontWeight="bold"
              isLoading={loading}
              loadingText="Processing"
            >
              Place Order
            </Button>
          </Box>
        </Box>

        {/* Order Summary */}
        <Box flex={0.5} bg="gray.700" p={8} borderRadius="lg" boxShadow="xl" h="fit-content">
          <Heading as="h2" size="xl" color="purple.300" fontWeight="bold" mb={6}>
            Order Summary
          </Heading>
          <VStack spacing={3} align="stretch" mb={6}>
            {cartItems.map((item) => (
              <Flex key={item._id} justify="space-between">
                <Text color="gray.300">
                  {item.name} x {item.quantity}
                </Text>
                <Text color="gray.300">
                  ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </Flex>
            ))}
          </VStack>
          <VStack spacing={3} align="stretch" borderTop="1px solid" borderColor="gray.600" pt={4}>
            <Flex justify="space-between">
              <Text fontSize="lg" color="gray.300">
                Items:
              </Text>
              <Text fontSize="lg" color="gray.300">
                ${itemsPrice.toFixed(2)}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="lg" color="gray.300">
                Shipping:
              </Text>
              <Text fontSize="lg" color="gray.300">
                ${shippingPrice.toFixed(2)}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="lg" color="gray.300">
                Tax:
              </Text>
              <Text fontSize="lg" color="gray.300">
                ${taxPrice.toFixed(2)}
              </Text>
            </Flex>
            <Flex justify="space-between" mt={6} pt={4} borderTop="1px solid" borderColor="gray.600">
              <Text fontSize="xl" color="purple.300" fontWeight="bold">
                Order Total:
              </Text>
              <Text fontSize="xl" color="purple.300" fontWeight="bold">
                ${totalPrice.toFixed(2)}
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default CheckoutPage;