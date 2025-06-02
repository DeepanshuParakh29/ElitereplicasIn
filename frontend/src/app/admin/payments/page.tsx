'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Tag, Flex, Spacer } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching payment data
    const fetchPayments = () => {
      const dummyPayments: Payment[] = [
        {
          id: 'pay_001',
          orderId: 'ord_101',
          customerName: 'Alice Smith',
          amount: 120.50,
          date: '2023-10-26T10:00:00Z',
          status: 'completed',
          method: 'Credit Card',
        },
        {
          id: 'pay_002',
          orderId: 'ord_102',
          customerName: 'Bob Johnson',
          amount: 75.00,
          date: '2023-10-25T14:30:00Z',
          status: 'pending',
          method: 'PayPal',
        },
        {
          id: 'pay_003',
          orderId: 'ord_103',
          customerName: 'Charlie Brown',
          amount: 200.00,
          date: '2023-10-24T09:15:00Z',
          status: 'failed',
          method: 'Stripe',
        },
        {
          id: 'pay_004',
          orderId: 'ord_104',
          customerName: 'Diana Prince',
          amount: 50.25,
          date: '2023-10-23T11:00:00Z',
          status: 'completed',
          method: 'Credit Card',
        },
      ];
      setPayments(dummyPayments);
      setLoading(false);
      // setError('Failed to load payments.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchPayments();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusTag = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Tag size="md" variant="solid" colorScheme="green"><FaCheckCircle style={{ marginRight: '4px' }} />Completed</Tag>;
      case 'pending':
        return <Tag size="md" variant="solid" colorScheme="orange"><FaHourglassHalf style={{ marginRight: '4px' }} />Pending</Tag>;
      case 'failed':
        return <Tag size="md" variant="solid" colorScheme="red"><FaTimesCircle style={{ marginRight: '4px' }} />Failed</Tag>;
      default:
        return <Tag size="md" variant="solid">Unknown</Tag>;
    }
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading payment data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Alert status="error" bg="orange.100" color="orange.800">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="purple.400">
        Payment Management
      </Heading>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        {payments.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Payment ID</Th>
                  <Th color="gray.300">Order ID</Th>
                  <Th color="gray.300">Customer</Th>
                  <Th color="gray.300" isNumeric>Amount</Th>
                  <Th color="gray.300">Date</Th>
                  <Th color="gray.300">Method</Th>
                  <Th color="gray.300">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.id}</Td>
                    <Td>{payment.orderId}</Td>
                    <Td>{payment.customerName}</Td>
                    <Td isNumeric>${payment.amount.toFixed(2)}</Td>
                    <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                    <Td>{payment.method}</Td>
                    <Td>{getStatusTag(payment.status)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No payments found.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default AdminPaymentsPage;