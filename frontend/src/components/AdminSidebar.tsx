'use client';

import React from 'react';
import { Box, VStack, Text, Link as ChakraLink, Image, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Admin Users', href: '/admin/admin-users' },
    { label: 'Vendors', href: '/admin/vendors' },
    { label: 'Reviews', href: '/admin/reviews' },
    { label: 'Payments', href: '/admin/payments' },
    { label: 'Discounts', href: '/admin/discounts' },
    { label: 'Integrations', href: '/admin/integrations' },
    { label: 'Marketing', href: '/admin/marketing' },
    { label: 'Mobile App', href: '/admin/mobile' },
    { label: 'Settings', href: '/admin/settings' },
    { label: 'Security', href: '/admin/security' },
    { label: 'Support', href: '/admin/support' },
    { label: 'UI Showcase', href: '/admin/ui' },
  ];

  return (
    <Box
      as="aside"
      w={{ base: 'full', md: '250px' }}
      bg="gray.800"
      p={4}
      shadow="lg"
      minH="100vh"
      position={{ base: 'relative', md: 'fixed' }}
      top={0}
      left={0}
      zIndex={10}
    >
      <VStack align="stretch" spacing={4}>
        <Box mb={8} textAlign="center">
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <Image src="/Logo.png" alt="Admin Logo" width={75} height={20} mx="auto" />
          </Link>
        </Box>
        <VStack as="nav" align="stretch" spacing={2}>
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none' }}
            >
              <Box
                p={2}
                borderRadius="md"
                _hover={{ bg: 'gray.700', color: 'white' }}
                bg={pathname === item.href ? 'purple.600' : 'transparent'}
                color={pathname === item.href ? 'white' : 'gray.300'}
                fontWeight={pathname === item.href ? 'bold' : 'normal'}
                transition="all 0.2s"
              >
                {item.label}
              </Box>
            </Link>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;