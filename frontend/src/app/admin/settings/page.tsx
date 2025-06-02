'use client';

import React, { useState } from 'react';
import { Container, Box, Heading, Text, FormControl, FormLabel, Input, Textarea, Button, Stack, useToast, Switch, Select, Flex, Spacer } from '@chakra-ui/react';

const AdminSettingsPage = () => {
  const toast = useToast();

  // State for general settings
  const [siteName, setSiteName] = useState('EliteReplicas.In');
  const [siteDescription, setSiteDescription] = useState('Your one-stop shop for premium replicas.');
  const [contactEmail, setContactEmail] = useState('support@elitereplicas.in');
  const [adminEmail, setAdminEmail] = useState('admin@elitereplicas.in');

  // State for security settings
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState(8);

  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // State for currency settings
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const handleSaveGeneralSettings = () => {
    // Simulate API call to save settings
    console.log('Saving general settings:', { siteName, siteDescription, contactEmail, adminEmail });
    toast({
      title: 'General Settings Saved.',
      description: 'Your general website settings have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveSecuritySettings = () => {
    console.log('Saving security settings:', { enableTwoFactorAuth, minPasswordLength });
    toast({
      title: 'Security Settings Saved.',
      description: 'Your security settings have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveNotificationSettings = () => {
    console.log('Saving notification settings:', { emailNotifications, smsNotifications });
    toast({
      title: 'Notification Settings Saved.',
      description: 'Your notification preferences have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveCurrencySettings = () => {
    console.log('Saving currency settings:', { currency, currencySymbol });
    toast({
      title: 'Currency Settings Saved.',
      description: 'Your currency settings have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Flex mb={8} alignItems="center">
        <Heading as="h1" size="xl" color="purple.400">Admin Settings</Heading>
        <Spacer />
      </Flex>

      <Stack spacing={10}>
        {/* General Settings */}
        <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
          <Heading as="h2" size="lg" mb={6} color="teal.300">General Settings</Heading>
          <Stack spacing={4}>
            <FormControl id="siteName">
              <FormLabel>Site Name</FormLabel>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <FormControl id="siteDescription">
              <FormLabel>Site Description</FormLabel>
              <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <FormControl id="contactEmail">
              <FormLabel>Contact Email</FormLabel>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <FormControl id="adminEmail">
              <FormLabel>Admin Email</FormLabel>
              <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <Button colorScheme="purple" onClick={handleSaveGeneralSettings} alignSelf="flex-end">
              Save General Settings
            </Button>
          </Stack>
        </Box>

        {/* Security Settings */}
        <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
          <Heading as="h2" size="lg" mb={6} color="teal.300">Security Settings</Heading>
          <Stack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="two-factor-auth" mb="0">
                Enable Two-Factor Authentication
              </FormLabel>
              <Switch id="two-factor-auth" isChecked={enableTwoFactorAuth} onChange={(e) => setEnableTwoFactorAuth(e.target.checked)} colorScheme="purple" />
            </FormControl>
            <FormControl id="minPasswordLength">
              <FormLabel>Minimum Password Length</FormLabel>
              <Input type="number" value={minPasswordLength} onChange={(e) => setMinPasswordLength(parseInt(e.target.value))} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <Button colorScheme="purple" onClick={handleSaveSecuritySettings} alignSelf="flex-end">
              Save Security Settings
            </Button>
          </Stack>
        </Box>

        {/* Notification Settings */}
        <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
          <Heading as="h2" size="lg" mb={6} color="teal.300">Notification Settings</Heading>
          <Stack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-notifications" mb="0">
                Email Notifications
              </FormLabel>
              <Switch id="email-notifications" isChecked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} colorScheme="purple" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="sms-notifications" mb="0">
                SMS Notifications
              </FormLabel>
              <Switch id="sms-notifications" isChecked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} colorScheme="purple" />
            </FormControl>
            <Button colorScheme="purple" onClick={handleSaveNotificationSettings} alignSelf="flex-end">
              Save Notification Settings
            </Button>
          </Stack>
        </Box>

        {/* Currency Settings */}
        <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
          <Heading as="h2" size="lg" mb={6} color="teal.300">Currency Settings</Heading>
          <Stack spacing={4}>
            <FormControl id="currency">
              <FormLabel>Currency</FormLabel>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)} bg="gray.700" borderColor="gray.600">
                <option value="USD">USD - United States Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                {/* Add more currencies as needed */}
              </Select>
            </FormControl>
            <FormControl id="currencySymbol">
              <FormLabel>Currency Symbol</FormLabel>
              <Input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} bg="gray.700" borderColor="gray.600" />
            </FormControl>
            <Button colorScheme="purple" onClick={handleSaveCurrencySettings} alignSelf="flex-end">
              Save Currency Settings
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default AdminSettingsPage;