'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Icon,
  useColorModeValue,
  Container,
  Divider,
  HStack,
  VStack,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { FaBox, FaShoppingCart, FaUsers, FaCog, FaChartLine, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/utils/api';
import { ADMIN_ENDPOINTS } from '@/config/api';

// Dashboard API response interface
interface DashboardResponse {
  success: boolean;
  message?: string;
  stats: {
    totalSales: number;
    salesGrowth: number;
    newUsers: number;
    userGrowth: number;
    avgOrderValue: number;
    avgOrderGrowth: number;
    productsSold: number;
    productGrowth: number;
    totalUsers: number;
    totalAdmins: number;
    storeStatus: string;
    maintenanceMode: string;
  };
}

const AdminDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const statCardBg = useColorModeValue('purple.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  
  // Dashboard stats - will be populated from API
  const [stats, setStats] = useState([
    { label: 'Total Sales', value: '$0', change: 0, icon: FaMoneyBillWave, color: 'green' },
    { label: 'New Users', value: '0', change: 0, icon: FaUsers, color: 'blue' },
    { label: 'Avg. Order Value', value: '$0', change: 0, icon: FaShoppingCart, color: 'red' },
    { label: 'Products Sold', value: '0', change: 0, icon: FaBox, color: 'green' },
  ]);
  
  // Dashboard summary data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    storeStatus: 'Offline',
    maintenanceMode: 'Off'
  });
  
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      const data = await apiGet<DashboardResponse>(ADMIN_ENDPOINTS.DASHBOARD_STATS);
      if (data.success) {
        // Update stats with real data
        setStats([
          { 
            label: 'Total Sales', 
            value: `$${data.stats.totalSales.toLocaleString()}`, 
            change: data.stats.salesGrowth, 
            icon: FaMoneyBillWave, 
            color: data.stats.salesGrowth >= 0 ? 'green' : 'red' 
          },
          { 
            label: 'New Users', 
            value: data.stats.newUsers.toLocaleString(), 
            change: data.stats.userGrowth, 
            icon: FaUsers, 
            color: data.stats.userGrowth >= 0 ? 'blue' : 'red' 
          },
          { 
            label: 'Avg. Order Value', 
            value: `$${data.stats.avgOrderValue.toLocaleString()}`, 
            change: data.stats.avgOrderGrowth, 
            icon: FaShoppingCart, 
            color: data.stats.avgOrderGrowth >= 0 ? 'green' : 'red' 
          },
          { 
            label: 'Products Sold', 
            value: data.stats.productsSold.toLocaleString(), 
            change: data.stats.productGrowth, 
            icon: FaBox, 
            color: data.stats.productGrowth >= 0 ? 'green' : 'red' 
          },
        ]);
        
        // Update dashboard summary data
        setDashboardData({
          totalUsers: data.stats.totalUsers,
          totalAdmins: data.stats.totalAdmins,
          storeStatus: data.stats.storeStatus,
          maintenanceMode: data.stats.maintenanceMode
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep the initial state if there's an error
    }
  };

  // Check authentication on mount
  useEffect(() => {
    setIsClient(true);
    console.log('Dashboard - Checking admin authentication');
    
    // Check admin authentication flag
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    console.log('Dashboard - adminAuthenticated:', isAdminAuthenticated);
    
    if (isAdminAuthenticated) {
      // Get admin info if available
      const adminInfoStr = localStorage.getItem('adminInfo');
      if (adminInfoStr) {
        try {
          const adminInfo = JSON.parse(adminInfoStr);
          setUserInfo(adminInfo);
          console.log('Dashboard - Admin info loaded:', adminInfo);
        } catch (error) {
          console.error('Error parsing admin info:', error);
          setUserInfo({ name: 'Admin' });
        }
      } else {
        setUserInfo({ name: 'Admin' });
      }
      
      // Verify token with the server
      const verifyToken = async (): Promise<void> => {
        try {
          // Define interface for token verification response
          interface TokenVerificationResponse {
            success: boolean;
            user?: {
              id: string;
              username: string;
              name: string;
              email: string;
              role: string;
            };
            message?: string;
          }
          
          const data = await apiGet<TokenVerificationResponse>(ADMIN_ENDPOINTS.VERIFY_TOKEN);
          
          if (data.success) {
            // Update user info with latest from server
            setUserInfo(data.user);
            setIsLoggedIn(true);
            // Fetch dashboard data after successful authentication
            fetchDashboardData();
          } else {
            // Token verification failed, redirect to login
            console.log('Dashboard - Token verification failed, redirecting to login');
            localStorage.removeItem('adminInfo');
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminToken');
            router.push('/admin/login');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsLoggedIn(true); // Still show dashboard if verification fails but local storage has data
        }
      };
      
      verifyToken();
    } else {
      // Not authenticated as admin, redirect to login
      console.log('Dashboard - Not authenticated, redirecting to login');
      router.push('/admin/login');
    }
  }, [router]);
  
  if (!isClient || !isLoggedIn) {
    return (
      <Box p={8} textAlign="center">
        <Heading>Loading dashboard...</Heading>
        <Progress size="xs" isIndeterminate colorScheme="purple" mt={4} />
      </Box>
    );
  }
  
  return (
    <Box minH="calc(100vh - 80px)" bg={bgColor} p={6}>
      <Container maxW="container.xl">
        <Flex direction="column" mb={8}>
          <Heading as="h1" size="xl" mb={2} color={accentColor}>
            Admin Dashboard
          </Heading>
          <Text color={textColor} fontSize="lg">
            Welcome back, {userInfo?.name}! Here's what's happening with your store today.
          </Text>
        </Flex>
        
        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <Stat key={index} px={6} py={4} bg={statCardBg} borderRadius="lg" boxShadow="md">
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel color={textColor} fontSize="sm" fontWeight="medium">{stat.label}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color={accentColor}>{stat.value}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={stat.change > 0 ? 'increase' : 'decrease'} />
                    {Math.abs(stat.change)}% (30 days)
                  </StatHelpText>
                </Box>
                <Flex alignItems="center" justifyContent="center" h="100%">
                  <Icon as={stat.icon} w={10} h={10} color={`${stat.color}.400`} />
                </Flex>
              </Flex>
            </Stat>
          ))}
        </SimpleGrid>
        
        {/* Main Dashboard Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {/* Manage Products */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor} overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
            <CardHeader bg={accentColor} py={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Products</Heading>
                <Icon as={FaBox} color="white" w={6} h={6} />
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Total Products</Text>
                  <Badge colorScheme="purple" fontSize="md" borderRadius="full" px={3}>124</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Out of Stock</Text>
                  <Badge colorScheme="red" fontSize="md" borderRadius="full" px={3}>7</Badge>
                </HStack>
                <Text color={textColor} fontSize="sm">Manage your product inventory, add new items, or update existing ones.</Text>
              </VStack>
            </CardBody>
            <Divider />
            <CardFooter pt={2} pb={4} px={6}>
              <Button as={Link} href="/admin/products" colorScheme="purple" width="full" leftIcon={<Icon as={FaBox} />}>
                Manage Products
              </Button>
            </CardFooter>
          </Card>
          
          {/* Manage Orders */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor} overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
            <CardHeader bg="blue.500" py={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Orders</Heading>
                <Icon as={FaClipboardList} color="white" w={6} h={6} />
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>New Orders</Text>
                  <Badge colorScheme="blue" fontSize="md" borderRadius="full" px={3}>18</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Processing</Text>
                  <Badge colorScheme="orange" fontSize="md" borderRadius="full" px={3}>5</Badge>
                </HStack>
                <Text color={textColor} fontSize="sm">View and manage customer orders, track shipments, and process returns.</Text>
              </VStack>
            </CardBody>
            <Divider />
            <CardFooter pt={2} pb={4} px={6}>
              <Button as={Link} href="/admin/orders" colorScheme="blue" width="full" leftIcon={<Icon as={FaClipboardList} />}>
                Manage Orders
              </Button>
            </CardFooter>
          </Card>
          
          {/* Manage Users */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor} overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
            <CardHeader bg="green.500" py={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Users</Heading>
                <Icon as={FaUsers} color="white" w={6} h={6} />
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Customers</Text>
                  <Badge colorScheme="green" fontSize="md" borderRadius="full" px={3}>{dashboardData.totalUsers}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Admins</Text>
                  <Badge colorScheme="purple" fontSize="md" borderRadius="full" px={3}>{dashboardData.totalAdmins}</Badge>
                </HStack>
                <Text color={textColor} fontSize="sm">Manage user accounts, permissions, and view customer profiles.</Text>
              </VStack>
            </CardBody>
            <Divider />
            <CardFooter pt={2} pb={4} px={6}>
              <Button as={Link} href="/admin/users" colorScheme="green" width="full" leftIcon={<Icon as={FaUsers} />}>
                Manage Users
              </Button>
            </CardFooter>
          </Card>
          
          {/* Analytics */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor} overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
            <CardHeader bg="orange.500" py={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Analytics</Heading>
                <Icon as={FaChartLine} color="white" w={6} h={6} />
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <Text color={textColor} fontSize="sm">View detailed analytics about your store's performance, sales trends, and customer behavior.</Text>
                <Box pt={2}>
                  <Text mb={1} fontSize="xs" color={textColor}>Sales Growth</Text>
                  <Progress value={75} size="sm" colorScheme="orange" borderRadius="full" />
                </Box>
                <Box>
                  <Text mb={1} fontSize="xs" color={textColor}>User Engagement</Text>
                  <Progress value={62} size="sm" colorScheme="orange" borderRadius="full" />
                </Box>
              </VStack>
            </CardBody>
            <Divider />
            <CardFooter pt={2} pb={4} px={6}>
              <Button as={Link} href="/admin/analytics" colorScheme="orange" width="full" leftIcon={<Icon as={FaChartLine} />}>
                View Analytics
              </Button>
            </CardFooter>
          </Card>
          
          {/* Settings */}
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor} overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
            <CardHeader bg="gray.500" py={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Settings</Heading>
                <Icon as={FaCog} color="white" w={6} h={6} />
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="stretch" spacing={4}>
                <Text color={textColor} fontSize="sm">Configure store settings, payment methods, shipping options, and more.</Text>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Store Status</Text>
                  <Badge colorScheme={dashboardData.storeStatus === 'Online' ? 'green' : 'red'} fontSize="md" borderRadius="full" px={3}>{dashboardData.storeStatus}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold" color={textColor}>Maintenance Mode</Text>
                  <Badge colorScheme={dashboardData.maintenanceMode === 'On' ? 'orange' : 'gray'} fontSize="md" borderRadius="full" px={3}>{dashboardData.maintenanceMode}</Badge>
                </HStack>
              </VStack>
            </CardBody>
            <Divider />
            <CardFooter pt={2} pb={4} px={6}>
              <Button as={Link} href="/admin/settings" colorScheme="gray" width="full" leftIcon={<Icon as={FaCog} />}>
                Manage Settings
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;