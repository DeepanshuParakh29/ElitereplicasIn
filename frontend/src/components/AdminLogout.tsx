'use client';

import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

interface AdminLogoutProps {
  variant?: 'link' | 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AdminLogout: React.FC<AdminLogoutProps> = ({ 
  variant = 'solid', 
  size = 'md' 
}) => {
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint to clear the HTTP-only cookie
      await apiPost(AUTH_ENDPOINTS.LOGOUT, {});

      // Clear local storage items
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      
      router.push('/admin/login');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      colorScheme="red"
    >
      Logout
    </Button>
  );
};

export default AdminLogout;
