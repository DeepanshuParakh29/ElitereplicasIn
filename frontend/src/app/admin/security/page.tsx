'use client';

import React, { useState } from 'react';
import { Container, Box, Heading, Text, FormControl, FormLabel, Input, Button, Stack, useToast, Alert, AlertIcon } from '@chakra-ui/react';

const AdminSecurityPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      setLoading(false);
      return;
    }

    // Simulate API call for changing password
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (currentPassword === 'wrongpass') {
        throw new Error('Incorrect current password.');
      }
      toast({
        title: 'Password changed.',
        description: 'Your password has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    setLoading(true);
    setError(null);
    // Simulate API call for toggling 2FA
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      toast({
        title: `Two-factor authentication ${twoFactorEnabled ? 'disabled' : 'enabled'}.`,
        description: `2FA has been ${twoFactorEnabled ? 'disabled' : 'enabled'} successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to toggle 2FA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8} minH="100vh" bg="gray.900" color="white">
      <Heading as="h1" size="xl" mb={6} color="purple.400">Security Settings</Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Change Password</Heading>
        <form onSubmit={handleChangePassword}>
          <Stack spacing={4}>
            <FormControl id="current-password">
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                required
              />
            </FormControl>
            <FormControl id="new-password">
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                required
              />
            </FormControl>
            <FormControl id="confirm-new-password">
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="purple" isLoading={loading} loadingText="Changing...">
              Change Password
            </Button>
          </Stack>
        </form>
      </Box>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        <Heading as="h2" size="lg" mb={4}>Two-Factor Authentication</Heading>
        <Text mb={4}>
          Two-factor authentication (2FA) adds an extra layer of security to your account.
          When enabled, you'll be required to enter a code from your authenticator app
          in addition to your password when logging in.
        </Text>
        <Button
          colorScheme={twoFactorEnabled ? 'red' : 'green'}
          onClick={handleToggleTwoFactor}
          isLoading={loading}
          loadingText={twoFactorEnabled ? 'Disabling...' : 'Enabling...'}
        >
          {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </Box>
    </Container>
  );
};

export default AdminSecurityPage;