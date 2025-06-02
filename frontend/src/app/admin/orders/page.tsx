'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Input, InputGroup, InputLeftElement, Flex, Spacer, Select, Badge, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { FaSearch, FaEye, FaCheck, FaTimes } from 'react-icons/fa';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrders = () => {
      const dummyOrders: Order[] = [
        {
          id: 'ORD001',
          customerName: 'Alice Smith',
          customerEmail: 'alice.smith@example.com',
          orderDate: '2023-10-26',
          status: 'delivered',
          totalAmount: 120.50,
          items: [
            { productId: 'P001', productName: 'Wireless Headphones', quantity: 1, price: 75.00 },
            { productId: 'P002', productName: 'USB-C Cable', quantity: 2, price: 12.75 },
          ],
          shippingAddress: '123 Main St, Anytown, USA',
          paymentMethod: 'Credit Card',
        },
        {
          id: 'ORD002',
          customerName: 'Bob Johnson',
          customerEmail: 'bob.j@example.com',
          orderDate: '2023-10-25',
          status: 'processing',
          totalAmount: 250.00,
          items: [
            { productId: 'P003', productName: 'Smartwatch', quantity: 1, price: 250.00 },
          ],
          shippingAddress: '456 Oak Ave, Somewhere, USA',
          paymentMethod: 'PayPal',
        },
        {
          id: 'ORD003',
          customerName: 'Charlie Brown',
          customerEmail: 'charlie.b@example.com',
          orderDate: '2023-10-24',
          status: 'pending',
          totalAmount: 55.99,
          items: [
            { productId: 'P004', productName: 'Portable Speaker', quantity: 1, price: 55.99 },
          ],
          shippingAddress: '789 Pine Ln, Nowhere, USA',
          paymentMethod: 'Credit Card',
        },
        {
          id: 'ORD004',
          customerName: 'Diana Prince',
          customerEmail: 'diana.p@example.com',
          orderDate: '2023-10-23',
          status: 'shipped',
          totalAmount: 300.00,
          items: [
            { productId: 'P005', productName: 'Gaming Laptop', quantity: 1, price: 1200.00 },
          ],
          shippingAddress: '101 Hero Way, Themyscira, USA',
          paymentMethod: 'Bank Transfer',
        },
        {
          id: 'ORD005',
          customerName: 'Eve Adams',
          customerEmail: 'eve.a@example.com',
          orderDate: '2023-10-22',
          status: 'cancelled',
          totalAmount: 45.00,
          items: [
            { productId: 'P006', productName: 'Phone Case', quantity: 1, price: 20.00 },
            { productId: 'P007', productName: 'Screen Protector', quantity: 1, price: 25.00 },
          ],
          shippingAddress: '222 Apple St, Garden City, USA',
          paymentMethod: 'Credit Card',
        },
      ];
      setOrders(dummyOrders);
      setLoading(false);
      // setError('Failed to load orders.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchOrders();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'teal';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading orders...</Text>
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
      <Flex mb={8} alignItems="center">
        <Heading as="h1" size="xl" color="purple.400">Order Management</Heading>
        <Spacer />
      </Flex>

      <Flex mb={6} wrap="wrap" gap={4}>
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={searchTerm}
            onChange={handleSearch}
            bg="gray.800"
            borderColor="gray.700"
            color="white"
            _placeholder={{ color: 'gray.500' }}
          />
        </InputGroup>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          bg="gray.800"
          borderColor="gray.700"
          color="white"
          width={{ base: '100%', md: 'auto' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </Flex>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        {filteredOrders.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Order ID</Th>
                  <Th color="gray.300">Customer</Th>
                  <Th color="gray.300">Date</Th>
                  <Th color="gray.300">Status</Th>
                  <Th color="gray.300">Total</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.customerName}</Td>
                    <Td>{order.orderDate}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                    </Td>
                    <Td>${order.totalAmount.toFixed(2)}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEye />} colorScheme="blue" mr={2} onClick={() => handleViewOrder(order)}>
                        View
                      </Button>
                      {order.status === 'pending' && (
                        <Button size="sm" leftIcon={<FaCheck />} colorScheme="green" onClick={() => handleUpdateOrderStatus(order.id, 'processing')}>
                          Process
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button size="sm" leftIcon={<FaCheck />} colorScheme="teal" onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}>
                          Ship
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <Button size="sm" leftIcon={<FaTimes />} colorScheme="red" ml={2} onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}>
                          Cancel
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No orders found matching your criteria.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>Order Details: {selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Text mb={2}><b>Customer Name:</b> {selectedOrder.customerName}</Text>
                <Text mb={2}><b>Customer Email:</b> {selectedOrder.customerEmail}</Text>
                <Text mb={2}><b>Order Date:</b> {selectedOrder.orderDate}</Text>
                <Text mb={2}><b>Status:</b> <Badge colorScheme={getStatusColor(selectedOrder.status)}>{selectedOrder.status.toUpperCase()}</Badge></Text>
                <Text mb={2}><b>Total Amount:</b> ${selectedOrder.totalAmount.toFixed(2)}</Text>
                <Text mb={2}><b>Shipping Address:</b> {selectedOrder.shippingAddress}</Text>
                <Text mb={4}><b>Payment Method:</b> {selectedOrder.paymentMethod}</Text>

                <Heading as="h3" size="md" mb={3}>Items:</Heading>
                <Table variant="simple" size="sm" colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th color="gray.300">Product</Th>
                      <Th color="gray.300">Quantity</Th>
                      <Th color="gray.300">Price</Th>
                      <Th color="gray.300">Subtotal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedOrder.items.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.productName}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>${item.price.toFixed(2)}</Td>
                        <Td>${(item.quantity * item.price).toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminOrdersPage;