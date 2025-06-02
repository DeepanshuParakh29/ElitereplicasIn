'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  AlertIcon,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const toast = useToast();
  const router = useRouter();
  
  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const error = validateEmail(email);
    setEmailError(error);
    
    if (error) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = await apiPost<{ success: boolean; message: string }>(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, { email });
      
      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: 'Reset email sent',
          description: 'If your email is registered, you will receive a password reset link shortly',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to send reset email',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while requesting password reset',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="purple.600">
          Reset Your Password
        </Heading>
        
        {!isSubmitted ? (
          <Box>
            <Text textAlign="center" mb={6}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <Box as="form" onSubmit={handleSubmit} maxW="md" mx="auto">
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!emailError}>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    size="lg"
                  />
                  {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  width="100%"
                >
                  Send Reset Link
                </Button>
                
                <Button
                  as={Link}
                  href="/login"
                  variant="outline"
                  size="md"
                  width="100%"
                >
                  Back to Login
                </Button>
              </VStack>
            </Box>
          </Box>
        ) : (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <Heading as="h2" size="md" mt={4} mb={1}>
              Check Your Email
            </Heading>
            <Text maxW="md" mb={6}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
            </Text>
            <Text fontSize="sm" color="gray.600">
              If you don't receive an email within a few minutes, please check your spam folder or try again.
            </Text>
            <Button
              as={Link}
              href="/login"
              colorScheme="purple"
              mt={6}
            >
              Return to Login
            </Button>
          </Alert>
        )}
      </VStack>
    </Container>
  );
};

export default PasswordResetRequestPage;
