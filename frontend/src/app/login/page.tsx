'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import {
  Container,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Link as ChakraLink,
  VStack,
  useToast,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  // Get the 'from' parameter to redirect after login
  const redirectPath = searchParams.get('from') || '/';

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
  
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    
    return '';
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (emailErr || passwordErr) {
      return;
    }
    
    setIsLoading(true);
    setVerificationNeeded(false);

    try {
      const data = await apiPost<{
        success: boolean;
        message: string;
        code?: string;
        token?: string;
        user?: any;
      }>(AUTH_ENDPOINTS.LOGIN, { email, password });
      
      if (data.success) {
        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Redirect to the original destination or home
        router.push(redirectPath);
      } else if (data.code === 'EMAIL_NOT_VERIFIED') {
        // Email not verified
        setVerificationNeeded(true);
      } else {
        toast({
          title: 'Login Failed',
          description: data.message || 'Invalid email or password.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    if (!email) {
      setEmailError('Email is required to resend verification');
      return;
    }
    
    setResendingVerification(true);
    
    try {
      const data = await apiPost<{
        success: boolean;
        message: string;
      }>(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email });
      
      if (data.success) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the verification link.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to Resend',
          description: data.message || 'Failed to resend verification email.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <Container maxW="lg" py={12}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        w="100%"
      >
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.600">
          Login to Your Account
        </Heading>
        
        {verificationNeeded && (
          <Alert status="warning" mb={6} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Email not verified</AlertTitle>
              <AlertDescription>
                Please verify your email address before logging in.
                <Button
                  onClick={handleResendVerification}
                  isLoading={resendingVerification}
                  loadingText="Sending..."
                  size="sm"
                  colorScheme="yellow"
                  ml={2}
                >
                  Resend verification email
                </Button>
              </AlertDescription>
            </Box>
          </Alert>
        )}
        
        <VStack as="form" onSubmit={handleLogin} spacing={6} align="stretch">
          <FormControl isInvalid={!!emailError}>
            <Input
              placeholder="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              size="lg"
              borderColor={emailError ? 'red.300' : 'gray.300'}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
            />
            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
          </FormControl>
          
          <FormControl isInvalid={!!passwordError}>
            <InputGroup size="lg">
              <Input
                placeholder="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                borderColor={passwordError ? 'red.300' : 'gray.300'}
                _hover={{ borderColor: 'purple.400' }}
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  variant="ghost"
                  onClick={toggleShowPassword}
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
          </FormControl>
          
          <ChakraLink as={NextLink} href="/reset-password/request" alignSelf="flex-end" color="purple.600" fontSize="sm">
            Forgot your password?
          </ChakraLink>
          
          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            width="full"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
          
          <Box textAlign="center" pt={4}>
            <Text fontSize="md" color="gray.600">
              Don't have an account?{' '}
              <ChakraLink as={NextLink} href="/register" color="purple.600" fontWeight="semibold">
                Sign Up
              </ChakraLink>
            </Text>
            
            <ChakraLink 
              as={NextLink} 
              href="/admin/login" 
              color="blue.600" 
              fontSize="sm"
              display="inline-block"
              mt={4}
            >
              Admin Login
            </ChakraLink>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}