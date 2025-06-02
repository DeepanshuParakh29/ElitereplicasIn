'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Box, Container, Heading, Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Spinner, Alert, useToast, Link } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, ViewIcon } from '@chakra-ui/icons';

interface ErrorType {
  message: string;
}

const MyOrdersPage = () => {
  const toast = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real application, fetch user's orders from your API
        // For now, use dummy data
        const dummyOrders = [
          {
            _id: 'order123',
            createdAt: '2023-01-15T10:00:00Z',
            totalPrice: 3750.00,
            isPaid: true,
            paidAt: '2023-01-15T10:05:00Z',
            isDelivered: false,
            deliveredAt: null,
          },
          {
            _id: 'order456',
            createdAt: '2023-02-20T14:30:00Z',
            totalPrice: 150.00,
            isPaid: false,
            paidAt: null,
            isDelivered: false,
            deliveredAt: null,
          },
          {
            _id: 'order789',
            createdAt: '2023-03-01T08:00:00Z',
            totalPrice: 500.00,
            isPaid: true,
            paidAt: '2023-03-01T08:02:00Z',
            isDelivered: true,
            deliveredAt: '2023-03-05T11:00:00Z',
          },
        ];
        setOrders(dummyOrders);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container display="flex" justifyContent="center" alignItems="center" minH="100vh" bg="#1a202c">
        <Spinner size="xl" color="#a78bfa" />
        <Text ml={2} color="white">Loading orders...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container display="flex" justifyContent="center" alignItems="center" minH="100vh" bg="#1a202c">
        <Alert status="error" w="100%" maxW="400px">Error: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container
      maxW="lg"
      minH="100vh"
      bg="#1a202c"
      color="white"
      py={8}
    >
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="#a78bfa" fontWeight="bold">
        My Orders
      </Heading>
      {orders.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Text fontSize="xl" color="#cbd5e0">
            You have not placed any orders yet.
          </Text>
        </Box>
      ) : (
        <Box bg="#2d3748" borderRadius="8px" overflow="hidden" boxShadow="lg">
          <TableContainer>
            <Table variant="simple" minW="650px" aria-label="simple table">
              <Thead bg="#4a5568">
                <Tr>
                  <Th color="#cbd5e0" fontWeight="bold">ID</Th>
                  <Th color="#cbd5e0" fontWeight="bold">Date</Th>
                  <Th color="#cbd5e0" fontWeight="bold">Total</Th>
                  <Th color="#cbd5e0" fontWeight="bold" textAlign="center">Paid</Th>
                  <Th color="#cbd5e0" fontWeight="bold" textAlign="center">Delivered</Th>
                  <Th color="#cbd5e0" fontWeight="bold" textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order: any) => (
                  <Tr
                    key={order._id}
                    _last={{ '& td, & th': { border: 0 } }}
                    _hover={{ bg: '#374151' }}
                  >
                    <Td color="#e2e8f0">
                      {order._id}
                    </Td>
                    <Td color="#cbd5e0">{order.createdAt.substring(0, 10)}</Td>
                    <Td color="#cbd5e0">${order.totalPrice.toFixed(2)}</Td>
                    <Td textAlign="center">
                      {order.isPaid ? (
                        <Box display="flex" alignItems="center" justifyContent="center" color="#38a169">
                          <CheckCircleIcon mr={1} /> {order.paidAt.substring(0, 10)}
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" color="#e53e3e">
                          <CloseIcon mr={1} /> Not Paid
                        </Box>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {order.isDelivered ? (
                        <Box display="flex" alignItems="center" justifyContent="center" color="#38a169">
                          <CheckCircleIcon mr={1} /> {order.deliveredAt.substring(0, 10)}
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" color="#e53e3e">
                          <CloseIcon mr={1} /> Not Delivered
                        </Box>
                      )}
                    </Td>
                    <Td textAlign="right">
                      <Link as={NextLink} href={`/profile/orders/${order._id}`}>
                        <Button
                          size="sm"
                          leftIcon={<ViewIcon />}
                          colorScheme="blue"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default MyOrdersPage;