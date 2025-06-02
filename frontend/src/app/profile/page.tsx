'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Flex } from '@chakra-ui/react';

const ProfileRedirectPage = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Redirect to the standardized user profile route
    router.replace('/user/profile');
    
    // Set a timeout to handle cases where the redirect doesn't happen immediately
    const timeoutId = setTimeout(() => {
      setIsRedirecting(false);
    }, 5000); // 5 second timeout as a fallback
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <Flex 
      minH="100vh" 
      bg="gray.900" 
      color="white" 
      justifyContent="center" 
      alignItems="center"
    >
      <Spinner 
        size="xl" 
        color="purple.500" 
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.700"
      />
    </Flex>
  );
};

export default ProfileRedirectPage;