'use client';

import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast, Container, VStack, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiPost<{
        success: boolean;
        message: string;
        user?: any;
        token?: string;
      }>(AUTH_ENDPOINTS.LOGIN, { username, password });

      if (data.success) {
        // Store admin info and token in localStorage
        // Remove password or sensitive data before storing
        const adminInfo = {
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isAdmin: true
        };
        
        // Clear any existing auth data first
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        
        // Set new auth data
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        localStorage.setItem('adminAuthenticated', 'true');
        
        // Store token in localStorage (the secure cookie is also set by the server)
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        
        toast({
          title: 'Login Successful.',
          description: `Welcome, ${adminInfo.name || 'Admin'}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Use a slight delay before redirecting to ensure localStorage is set
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 100);
      } else {
        setError(data.message || 'Login failed');
        toast({
          title: 'Login Failed.',
          description: data.message || 'Invalid username or password.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      toast({
        title: 'Error.',
        description: error.message || 'An error occurred during login.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent minH="100vh" bg="gray.900" color="white">
      <VStack spacing={8} p={8} bg="gray.800" borderRadius="lg" shadow="xl" maxW="md" width="full">
        <Image src="/Logo.png" alt="EliteReplicas.In Logo" width={200} />
        <Heading as="h1" size="xl" color="purple.400">Admin Login</Heading>
        
        {error && (
          <Text color="red.400" textAlign="center">
            {error}
          </Text>
        )}
        
        <Box as="form" onSubmit={handleLogin} width="full">
          <VStack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                isRequired
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                isRequired
              />
            </FormControl>
            <Button 
              type="submit" 
              colorScheme="purple" 
              size="lg" 
              width="full"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default AdminLoginPage;