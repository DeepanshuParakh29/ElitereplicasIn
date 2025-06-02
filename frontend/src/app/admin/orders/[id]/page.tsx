'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Text, Heading, Box, Spinner, Alert, AlertIcon, SimpleGrid, List, ListItem, Divider, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Badge } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const AdminOrderDetailPage = () => {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Placeholder for fetching a single order - replace with actual API call
      const dummyOrder = {
        _id: orderId,
        user: { name: 'John Doe', email: 'john.doe@example.com' },
        shippingAddress: {
          address: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        paymentResult: {
          id: 'pay_12345',
          status: 'completed',
          update_time: '2023-01-15T10:05:00Z',
          email_address: 'john.doe@example.com',
        },
        taxPrice: 15.00,
        shippingPrice: 10.00,
        totalPrice: 150.75,
        isPaid: true,
        paidAt: '2023-01-15T10:05:00Z',
        isDelivered: false,
        deliveredAt: null,
        orderItems: [
          { name: 'Luxury Watch A', qty: 1, image: '/images/products/watch1.jpg', price: 125.75, product: 'prod_watch_a' },
          { name: 'Sport Shoes C', qty: 1, image: '/images/products/shoe1.jpg', price: 10.00, product: 'prod_shoe_c' },
        ],
        createdAt: '2023-01-15T10:00:00Z',
      };

      setOrder(dummyOrder);
      setLoading(false);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const markAsDeliveredHandler = () => {
    // Implement actual API call to mark order as delivered
    console.log(`Mark order ${orderId} as delivered`);
    alert(`Order ${orderId} marked as delivered (simulated)`);
    // In a real app, you'd update the state after a successful API call
    setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Flex direction="row" align="center">
          <Spinner size="xl" color="purple.400" />
          <Text ml={4} fontSize="xl">Loading order details...</Text>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Alert status="error" bg="orange.100" color="orange.800">
          <AlertIcon />
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Text fontSize="xl">Order not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={4} bg="gray.900" color="white" minH="100vh">
      <Heading as="h1" textAlign="center" mb={6} color="purple.400" fontWeight="bold">
        Order Details
      </Heading>

      <Box p={4} bg="gray.800" borderRadius="lg" shadow="xl" mb={4}>
        <Heading as="h2" size="md" color="white" mb={3}>Order ID: {order._id}</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Heading as="h3" size="sm" color="purple.400" mb={2}>Shipping</Heading>
            <List spacing={2} color="gray.300">
              <ListItem>
                <Text>Name: {order.user.name}</Text>
              </ListItem>
              <ListItem>
                <Text>Email: <Link href={`mailto:${order.user.email}`} style={{ color: '#a78bfa', textDecoration: 'none' }}>{order.user.email}</Link></Text>
              </ListItem>
              <ListItem>
                <Text>Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</Text>
              </ListItem>
              <ListItem>
                <Flex mt={2} p={1.5} borderRadius="md" alignItems="center" bg={order.isDelivered ? "green.500" : "red.500"}>
                  {order.isDelivered ? (
                    <CheckIcon mr={2} />
                  ) : (
                    <CloseIcon mr={2} />
                  )}
                  <Text fontSize="sm">
                    {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
                  </Text>
                </Flex>
              </ListItem>
            </List>
          </Box>

          <Box>
            <Heading as="h3" size="sm" color="purple.400" mb={2}>Payment</Heading>
            <List spacing={2} color="gray.300">
              <ListItem>
                <Text>Method: {order.paymentMethod}</Text>
              </ListItem>
              <ListItem>
                <Flex mt={2} p={1.5} borderRadius="md" alignItems="center" bg={order.isPaid ? "green.500" : "red.500"}>
                  {order.isPaid ? (
                    <CheckIcon mr={2} />
                  ) : (
                    <CloseIcon mr={2} />
                  )}
                  <Text fontSize="sm">
                    {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                  </Text>
                </Flex>
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>

        <Divider my={4} borderColor="gray.600" />

        <Heading as="h3" size="sm" color="purple.400" mb={2}>Order Items</Heading>
        <Box bg="gray.800" borderRadius="lg" overflow="hidden">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead bg="gray.700">
              <Tr>
                <Th color="gray.300">Product</Th>
                <Th color="gray.300">Quantity</Th>
                <Th color="gray.300">Price</Th>
                <Th color="gray.300">Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {order.orderItems.map((item: any) => (
                <Tr key={item.product} _odd={{ bg: "gray.800" }} _even={{ bg: "gray.700" }}>
                  <Td color="white">
                    <Link href={`/products/${item.product}`} style={{ color: '#a78bfa', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </Td>
                  <Td color="white">{item.qty}</Td>
                  <Td color="white">${item.price.toFixed(2)}</Td>
                  <Td color="white">${(item.qty * item.price).toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box mt={4} textAlign="right">
          <Text fontSize="md" color="gray.300">Items Price: ${order.orderItems.reduce((acc: number, item: any) => acc + item.qty * item.price, 0).toFixed(2)}</Text>
          <Text fontSize="md" color="gray.300">Shipping: ${order.shippingPrice.toFixed(2)}</Text>
          <Text fontSize="md" color="gray.300">Tax: ${order.taxPrice.toFixed(2)}</Text>
          <Text fontSize="lg" color="white" fontWeight="bold" mt={2}>Total: ${order.totalPrice.toFixed(2)}</Text>
        </Box>

        {!order.isDelivered && (
          <Box mt={4} textAlign="center">
            <Button
              onClick={markAsDeliveredHandler}
              colorScheme="green"
              size="lg"
              borderRadius="full"
              px={8}
              py={6}
              fontWeight="bold"
            >
              Mark As Delivered
            </Button>
          </Box>
        )}

        <Box mt={4} textAlign="center">
          <Link href="/admin/orders" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '1.125rem' }}>
            ← Back to Orders
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminOrderDetailPage;