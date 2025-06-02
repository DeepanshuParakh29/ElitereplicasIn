'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast, Spinner, Center, Box, Text } from '@chakra-ui/react';
import { apiGet } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

interface AuthCheckerProps {
  children: React.ReactNode;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  
  // State to track if we've checked authentication
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use a ref to prevent multiple redirects
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return;
    
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        console.log('Checking admin authentication...');
        
        // Check if user is authenticated via localStorage
        const authStatus = localStorage.getItem('adminAuthenticated') === 'true';
        const adminInfo = localStorage.getItem('adminInfo');
        const adminToken = localStorage.getItem('adminToken');
        
        console.log('Auth status:', authStatus, 'Current path:', pathname);
        console.log('Admin info exists:', !!adminInfo);
        console.log('Admin token exists:', !!adminToken);
        
        // Verify authentication with the server
        if (authStatus && adminInfo) {
          try {
            // Make a request to a protected endpoint to verify the token
            const data = await apiGet<{success: boolean, user?: any}>(AUTH_ENDPOINTS.VERIFY_TOKEN);
            
            if (data.success) {
              setIsAuthenticated(true);
              setIsChecking(false);
              return; // Exit early if authenticated
            } else {
              // Token is invalid, clear auth data
              localStorage.removeItem('adminInfo');
              localStorage.removeItem('adminAuthenticated');
              localStorage.removeItem('adminToken');
              setIsAuthenticated(false);
            }
          } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            // Continue with redirect on error
          }
        } else {
          setIsAuthenticated(false);
        }
        
        // If not authenticated and not on login page, redirect
        if (pathname !== '/admin/login' && !hasRedirected.current) {
          console.log('Not authenticated, redirecting to login');
          hasRedirected.current = true;
          toast({
            title: 'Access Denied',
            description: 'You must be logged in as an administrator to access this page.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    // Run the check
    checkAuth();
    
    // Reset the redirect flag when pathname changes
    return () => {
      hasRedirected.current = false;
    };
  }, [pathname, router, toast]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <Center h="calc(100vh - 100px)">
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" thickness="4px" speed="0.65s" />
          <Text mt={4} color="gray.400">Verifying authentication...</Text>
        </Box>
      </Center>
    );
  }

  // Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthChecker;