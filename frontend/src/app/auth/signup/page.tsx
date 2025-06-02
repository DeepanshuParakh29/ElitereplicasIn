'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Heading, Text, Input, Button, VStack, useToast, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await apiPost<{ success: boolean; message: string }>(AUTH_ENDPOINTS.REGISTER, {
        name,
        email,
        password
      });

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const userData = await apiPost<{ success: boolean; user: any; message?: string }>(AUTH_ENDPOINTS.LOGIN, {
        email,
        password
      });

      if (!userData.success) {
        throw new Error(userData.message || 'Login failed');
      }

      localStorage.setItem('userInfo', JSON.stringify(userData.user));
      toast({
        title: 'Sign up successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      toast({
        title: 'Sign up failed.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
    >
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={{ base: 'transparent', sm: 'gray.700' }}
        boxShadow={{ base: 'none', sm: 'xl' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
        w="full"
        maxW="md"
      >
        <VStack spacing={8}>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white">
            Sign Up
          </Heading>
          <Box as="form" onSubmit={handleSubmit} w="full">
            <VStack spacing={4}>
              <Input
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                size="lg"
                variant="filled"
                bg="gray.800"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: 'gray.700' }}
                _focus={{ bg: 'gray.700', borderColor: 'purple.500' }}
              />
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="lg"
                variant="filled"
                bg="gray.800"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: 'gray.700' }}
                _focus={{ bg: 'gray.700', borderColor: 'purple.500' }}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
                variant="filled"
                bg="gray.800"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: 'gray.700' }}
                _focus={{ bg: 'gray.700', borderColor: 'purple.500' }}
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                size="lg"
                variant="filled"
                bg="gray.800"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: 'gray.700' }}
                _focus={{ bg: 'gray.700', borderColor: 'purple.500' }}
              />
              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                fontSize="md"
                w="full"
                mt={4}
              >
                Sign Up
              </Button>
            </VStack>
          </Box>
          <Text fontSize="sm" color="gray.400">
            Already have an account?{' '}
            <ChakraLink as={Link} href="/login" color="purple.300" _hover={{ color: 'purple.200' }}>
              Login
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default SignUpPage;