'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Verification token is missing');
        return;
      }
      
      setIsVerifying(true);
      
      try {
        const data = await apiPost<{ success: boolean; message: string }>(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
        
        if (data.success) {
          setIsVerified(true);
          toast({
            title: 'Email verified!',
            description: 'Your email has been successfully verified.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          setError(data.message || 'Failed to verify email');
          toast({
            title: 'Verification failed',
            description: data.message || 'Failed to verify email',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error('Error verifying email:', err);
        setError('An error occurred during verification');
        toast({
          title: 'Verification error',
          description: 'An error occurred during verification',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyEmail();
  }, [searchParams, toast]);
  
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="center" textAlign="center">
        <Heading as="h1" size="xl" color="purple.600">
          Email Verification
        </Heading>
        
        {isVerifying && (
          <Box textAlign="center" py={10}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
            />
            <Text mt={4} fontSize="lg">
              Verifying your email...
            </Text>
          </Box>
        )}
        
        {!isVerifying && isVerified && (
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
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Email Verified!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Your email has been successfully verified. You can now log in to your account.
            </AlertDescription>
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
        
        {!isVerifying && error && (
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
              Verification Failed
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error}
            </AlertDescription>
            <VStack spacing={4} mt={6}>
              <Button
                as={Link}
                href="/login"
                colorScheme="purple"
                variant="outline"
              >
                Go to Login
              </Button>
              <Button
                as={Link}
                href="/"
                colorScheme="gray"
              >
                Return to Home
              </Button>
            </VStack>
          </Alert>
        )}
      </VStack>
    </Container>
  );
};

export default VerifyEmailPage;
