'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Spinner, Alert } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Jan', 'Sales': 4000, 'Users': 2400 },
  { name: 'Feb', 'Sales': 3000, 'Users': 1398 },
  { name: 'Mar', 'Sales': 2000, 'Users': 9800 },
  { name: 'Apr', 'Sales': 2780, 'Users': 3908 },
  { name: 'May', 'Sales': 1890, 'Users': 4800 },
  { name: 'Jun', 'Sales': 2390, 'Users': 3800 },
  { name: 'Jul', 'Sales': 3490, 'Users': 4300 },
];

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setLoading(false);
      // setError('Failed to load analytics data.'); // Uncomment to test error state
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading analytics data...</Text>
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
        Website Analytics
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800">
          <StatLabel fontSize="lg" color="gray.300">Total Sales</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.300">$12,500</StatNumber>
          <StatHelpText color="gray.400">
            <StatArrow type="increase" />
            23.36% (30 days)
          </StatHelpText>
        </Stat>

        <Stat p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800">
          <StatLabel fontSize="lg" color="gray.300">New Users</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.300">1,200</StatNumber>
          <StatHelpText color="gray.400">
            <StatArrow type="increase" />
            15.00% (30 days)
          </StatHelpText>
        </Stat>

        <Stat p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800">
          <StatLabel fontSize="lg" color="gray.300">Avg. Order Value</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.300">$105.20</StatNumber>
          <StatHelpText color="gray.400">
            <StatArrow type="decrease" />
            5.10% (30 days)
          </StatHelpText>
        </Stat>

        <Stat p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800">
          <StatLabel fontSize="lg" color="gray.300">Products Sold</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.300">5,800</StatNumber>
          <StatHelpText color="gray.400">
            <StatArrow type="increase" />
            18.75% (30 days)
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800" height="400px">
          <Heading as="h3" size="md" mb={4} color="gray.200">Sales & User Growth</Heading>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Users" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box p={5} shadow="md" border="1px" borderColor="gray.700" borderRadius="lg" bg="gray.800" height="400px">
          <Heading as="h3" size="md" mb={4} color="gray.200">Top Selling Categories</Heading>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={[
              { name: 'Electronics', sales: 3000 },
              { name: 'Apparel', sales: 2000 },
              { name: 'Home Goods', sales: 1500 },
              { name: 'Books', sales: 1000 },
            ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Legend />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default AdminAnalyticsPage;