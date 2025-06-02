'use client';

import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminLogout from '@/components/AdminLogout';
import AuthChecker from './AuthChecker';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  
  // Add client-side detection
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Debug localStorage on client side
    if (typeof window !== 'undefined') {
      console.log('Admin Layout - Current pathname:', pathname);
      console.log('Admin Layout - isLoginPage:', isLoginPage);
      console.log('Admin Layout - admin_authenticated:', localStorage.getItem('admin_authenticated'));
    }
  }, [pathname, isLoginPage]);
  
  // Only render the full layout on the client side
  if (!isMounted) {
    return (
      <Box display="flex" minH="100vh" bg="gray.900" color="white">
        <Box flex="1" p={4}>
          {isLoginPage ? children : null}
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" minH="100vh" bg="gray.900">
      {!isLoginPage && <AdminSidebar />}
      <Box flex="1" ml={!isLoginPage ? "250px" : "0"} color="white">
        {!isLoginPage && (
          <Flex 
            as="header" 
            bg="gray.800" 
            p={4} 
            alignItems="center" 
            borderBottom="1px solid" 
            borderColor="gray.700"
          >
            <Heading size="md" color="purple.400">EliteReplicas Admin</Heading>
            <Spacer />
            <AdminLogout size="sm" variant="outline" />
          </Flex>
        )}
        <Box p={4}>
          {isLoginPage ? children : <AuthChecker>{children}</AuthChecker>}
        </Box>
      </Box>
    </Box>
  );
}