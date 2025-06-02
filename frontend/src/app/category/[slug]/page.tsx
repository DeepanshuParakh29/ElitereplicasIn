'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Spinner, Flex } from '@chakra-ui/react';

const CategoryRedirectPage = () => {
  const params = useParams();
  const categorySlug = params.slug as string;
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Redirect to the standardized categories route
    router.replace(`/categories/${categorySlug}`);
    
    // Set a timeout to handle cases where the redirect doesn't happen immediately
    const timeoutId = setTimeout(() => {
      setIsRedirecting(false);
    }, 5000); // 5 second timeout as a fallback
    
    return () => clearTimeout(timeoutId);
  }, [categorySlug, router]);

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

export default CategoryRedirectPage;