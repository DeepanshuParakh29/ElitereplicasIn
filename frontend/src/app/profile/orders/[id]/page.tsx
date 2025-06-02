'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardBody, Button, Checkbox, RadioGroup, Radio, Stack, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Input, useToast, List, ListItem, Divider, Alert, Spinner, Avatar } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

interface User {
  name: string;
  email: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface Order {
  _id: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
}

const OrderDetailsPage = () => {
  const params = useParams();
  const { id: orderId } = params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real application, fetch order details from your API
        // For now, use dummy data
        const dummyOrders = [
          {
            _id: 'order123',
            user: { name: 'John Doe', email: 'john.doe@example.com' },
            orderItems: [
              { name: 'Luxury Watch', qty: 1, image: '/images/watch1.jpg', price: 2500, product: 'prod1' },
              { name: 'Designer Handbag', qty: 1, image: '/images/handbag1.jpg', price: 1200, product: 'prod2' },
            ],
            shippingAddress: {
              address: '123 Main St',
              city: 'Anytown',
              postalCode: '12345',
              country: 'USA',
            },
            paymentMethod: 'PayPal',
            itemsPrice: 3700,
            shippingPrice: 50,
            taxPrice: 555,
            totalPrice: 4305,
            isPaid: true,
            paidAt: '2023-01-15T10:05:00Z',
            isDelivered: false,
            deliveredAt: null,
            createdAt: '2023-01-15T10:00:00Z',
          },
          {
            _id: 'order456',
            user: { name: 'Jane Smith', email: 'jane.smith@example.com' },
            orderItems: [
              { name: 'Smart Speaker', qty: 1, image: '/images/speaker1.jpg', price: 150, product: 'prod3' },
            ],
            shippingAddress: {
              address: '456 Oak Ave',
              city: 'Otherville',
              postalCode: '67890',
              country: 'USA',
            },
            paymentMethod: 'Stripe',
            itemsPrice: 150,
            shippingPrice: 10,
            taxPrice: 22.5,
            totalPrice: 182.5,
            isPaid: false,
            paidAt: null,
            isDelivered: false,
            deliveredAt: null,
            createdAt: '2023-02-20T14:30:00Z',
          },
          {
            _id: 'order789',
            user: { name: 'Peter Jones', email: 'peter.jones@example.com' },
            orderItems: [
              { name: 'Gaming Keyboard', qty: 1, image: '/images/keyboard1.jpg', price: 100, product: 'prod4' },
              { name: 'Gaming Mouse', qty: 1, image: '/images/mouse1.jpg', price: 50, product: 'prod5' },
            ],
            shippingAddress: {
              address: '789 Pine Ln',
              city: 'Anywhere',
              postalCode: '54321',
              country: 'USA',
            },
            paymentMethod: 'PayPal',
            itemsPrice: 150,
            shippingPrice: 0,
            taxPrice: 22.5,
            totalPrice: 172.5,
            isPaid: true,
            paidAt: '2023-03-01T08:02:00Z',
            isDelivered: true,
            deliveredAt: '2023-03-05T11:00:00Z',
            createdAt: '2023-03-01T08:00:00Z',
          },
        ];
        const foundOrder = dummyOrders.find(o => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder as any);
        } else {
          setError(new Error('Order not found'));
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container display="flex" justifyContent="center" alignItems="center" minH="80vh">
        <Spinner size="xl" />
        <Text fontSize="xl" ml={2}>Loading order details...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container display="flex" justifyContent="center" alignItems="center" minH="80vh">
        <Alert status="error">Error: {error.message}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container display="flex" justifyContent="center" alignItems="center" minH="80vh">
        <Text fontSize="xl">Order not found.</Text>
      </Container>
    );
  }

  return (
    <Container py={4}>
      <Box p={4} bg="white" boxShadow="lg" borderRadius="md">
        <Heading as="h1" size="xl" mb={4} color="purple.600">Order {order._id}</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Heading as="h2" size="lg" mb={2}>Shipping</Heading>
            <Text><strong>Name:</strong> {order.user.name}</Text>
            <Text><strong>Email:</strong> <a href={`mailto:${order.user.email}`} style={{ color: '#9c27b0', textDecoration: 'underline' }}>{order.user.email}</a></Text>
            <Text>
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </Text>
            <Box mt={2}>
              {order.isDelivered ? (
                <Alert status="success">
                  <CheckCircleIcon mr={2} />
                  Delivered on {order.deliveredAt?.substring(0, 10)}
                </Alert>
              ) : (
                <Alert status="warning">
                  <WarningIcon mr={2} />
                  Not Delivered
                </Alert>
              )}
            </Box>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={2}>Payment Method</Heading>
            <Text><strong>Method:</strong> {order.paymentMethod}</Text>
            <Box mt={2}>
              {order.isPaid ? (
                <Alert status="success">
                  <CheckCircleIcon mr={2} />
                  Paid on {order.paidAt?.substring(0, 10)}
                </Alert>
              ) : (
                <Alert status="warning">
                  <WarningIcon mr={2} />
                  Not Paid
                </Alert>
              )}
            </Box>
          </Box>

          <Box gridColumn="1 / -1">
            <Heading as="h2" size="lg" mb={2}>Order Items</Heading>
            <List spacing={3}>
              {order.orderItems.map((item) => (
                <ListItem key={item.product} display="flex" alignItems="center" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                  <Avatar src={item.image} name={item.name} size="md" borderRadius="md" mr={4} />
                  <Box flex="1">
                    <Box as={Link} href={`/product/${item.product}`}>
                      <Text fontSize="md" fontWeight="bold" color="purple.600" _hover={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        {item.name}
                      </Text>
                    </Box>
                  </Box>
                  <Text fontSize="md">
                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box gridColumn={{ base: "1 / -1", md: "2 / 3" }} p={4} bg="gray.50" boxShadow="md" borderRadius="md">
            <Heading as="h2" size="lg" mb={4}>Order Summary</Heading>
            <List spacing={2}>
              <ListItem display="flex" justifyContent="space-between">
                <Text>Items</Text>
                <Text>${order.itemsPrice.toFixed(2)}</Text>
              </ListItem>
              <ListItem display="flex" justifyContent="space-between">
                <Text>Shipping</Text>
                <Text>${order.shippingPrice.toFixed(2)}</Text>
              </ListItem>
              <ListItem display="flex" justifyContent="space-between">
                <Text>Tax</Text>
                <Text>${order.taxPrice.toFixed(2)}</Text>
              </ListItem>
              <Divider />
              <ListItem display="flex" justifyContent="space-between">
                <Text fontSize="xl" fontWeight="bold">Total</Text>
                <Text fontSize="xl" fontWeight="bold">${order.totalPrice.toFixed(2)}</Text>
              </ListItem>
            </List>
            <Button colorScheme="purple" size="lg" width="full" mt={4}>
              Proceed to Payment
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  );

};

export default OrderDetailsPage;