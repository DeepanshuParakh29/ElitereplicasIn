'use client';

import React from 'react';
import NextLink from 'next/link';
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
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useCart } from '@/hooks/useCart';

const CartPage = () => {
  const { state: { cartItems }, dispatch } = useCart();

  const removeItemFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
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

  if (cartItems.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Heading>Your Cart is Empty</Heading>
          <Text>Add some items to your cart to see them here.</Text>
          <Button
            as={NextLink}
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
                            {[...Array(item.countInStock)].map((_, i) => (
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
                    as={NextLink}
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
