'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTitle,
  AlertDescription,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

const PasswordResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const toast = useToast();
  const router = useRouter();
  
  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      setTokenError('Reset token is missing. Please use the link from your email.');
    }
  }, [token]);
  
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    return '';
  };
  
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    
    return '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordErr = validatePassword(password);
    setPasswordError(passwordErr);
    
    // Validate confirm password
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);
    setConfirmPasswordError(confirmPasswordErr);
    
    if (passwordErr || confirmPasswordErr || !token) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = await apiPost<{ success: boolean; message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
      
      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: 'Password reset successful',
          description: 'Your password has been reset successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to reset password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while resetting your password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  if (tokenError) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          py={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Invalid Reset Link
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {tokenError}
          </AlertDescription>
          <VStack spacing={4} mt={6}>
            <Button
              as={Link}
              href="/reset-password/request"
              colorScheme="purple"
            >
              Request New Reset Link
            </Button>
            <Button
              as={Link}
              href="/login"
              variant="outline"
            >
              Return to Login
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="purple.600">
          Reset Your Password
        </Heading>
        
        {!isSubmitted ? (
          <Box>
            <Text textAlign="center" mb={6}>
              Please enter your new password below.
            </Text>
            
            <Box as="form" onSubmit={handleSubmit} maxW="md" mx="auto">
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!passwordError}>
                  <FormLabel htmlFor="password">New Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      size="lg"
                    />
                    <InputRightElement h="full">
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
                
                <FormControl isInvalid={!!confirmPasswordError}>
                  <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      size="lg"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        variant="ghost"
                        onClick={toggleShowConfirmPassword}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {confirmPasswordError && <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>}
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Resetting..."
                  width="100%"
                >
                  Reset Password
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
              Password Reset Successful
            </Heading>
            <Text maxW="md" mb={6}>
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </Text>
            <Button
              as={Link}
              href="/login"
              colorScheme="purple"
              mt={6}
            >
              Go to Login
            </Button>
          </Alert>
        )}
      </VStack>
    </Container>
  );
};

export default PasswordResetPage;
