'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Badge,
  Flex,
  useColorModeValue,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { apiGet } from '@/utils/api';
import { USER_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
  // Add other user details as needed
}

interface Order {
  _id: string;
  orderItems: any[];
  shippingAddress: any;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const UserProfilePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('purple.500', 'purple.300');
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const tableBg = useColorModeValue('gray.50', 'gray.800');
  const tableHeaderBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);
  
  // Fetch user orders from the backend API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiGet<{success: boolean; orders: Order[]; message?: string}>(USER_ENDPOINTS.ORDERS);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch orders');
        }
        
        setOrders(response.orders);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching your orders');
        toast({
          title: 'Error',
          description: error.message || 'Failed to load your orders',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, toast]);



  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'green';
      case 'Processing': return 'yellow';
      case 'Shipped': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" textAlign="center" mb={6} color={headingColor}>
        User Profile
      </Heading>

      <Card bg={cardBg} shadow="md" borderRadius="lg">
        <CardBody>
          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={setTabIndex} mb={4}>
            <TabList mb={4}>
              <Tab fontWeight="semibold">Profile Information</Tab>
              <Tab fontWeight="semibold">My Orders</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading as="h2" size="md" mb={4} color={headingColor}>
                  Personal Details
                </Heading>
                
                {userInfo ? (
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} fontSize="lg">
                    <GridItem>
                      <Flex>
                        <Text fontWeight="bold" color={labelColor} mr={2}>Name:</Text>
                        <Text>{userInfo.name}</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex>
                        <Text fontWeight="bold" color={labelColor} mr={2}>Email:</Text>
                        <Text>{userInfo.email}</Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex>
                        <Text fontWeight="bold" color={labelColor} mr={2}>Admin:</Text>
                        <Text>{userInfo.isAdmin ? 'Yes' : 'No'}</Text>
                      </Flex>
                    </GridItem>
                  </Grid>
                ) : (
                  <Text>Loading user information...</Text>
                )}
                
                <Button colorScheme="purple" mt={6}>
                  Edit Profile
                </Button>
              </TabPanel>
              
              <TabPanel>
                <Heading as="h2" size="md" mb={4} color={headingColor}>
                  Order History
                </Heading>
                
                {loading ? (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="xl" color="purple.500" />
                  </Flex>
                ) : error ? (
                  <Text color="red.500">{error}</Text>
                ) : orders.length === 0 ? (
                  <Text>You have no orders yet.</Text>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={tableHeaderBg}>
                        <Tr>
                          <Th>Order ID</Th>
                          <Th>Date</Th>
                          <Th>Total</Th>
                          <Th>Status</Th>
                          <Th textAlign="center">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orders.map((order) => (
                          <Tr key={order._id}>
                            <Td fontWeight="medium">{order._id.substring(0, 8)}</Td>
                            <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                            <Td>${order.totalPrice.toFixed(2)}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(order.status)} px={2} py={1} borderRadius="full">
                                {order.status}
                              </Badge>
                            </Td>
                            <Td textAlign="center">
                              <Button size="sm" colorScheme="purple" as="a" href={`/orders/${order._id}`}>
                                View Details
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Container>
  );
};

export default UserProfilePage;