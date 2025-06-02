'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardHeader, CardBody, Button, useToast, Spinner, Alert, Flex, Spacer, Link, FormControl, FormLabel, Switch, Input, Textarea } from '@chakra-ui/react';
import { FaMobileAlt, FaCog, FaUpload, FaBell } from 'react-icons/fa';

interface MobileSetting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'input' | 'textarea' | 'button';
  value?: boolean | string;
  actionLabel?: string;
  action?: () => void;
}

const AdminMobilePage = () => {
  const [mobileSettings, setMobileSettings] = useState<MobileSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching mobile settings data
    const fetchMobileSettings = () => {
      const dummyMobileSettings: MobileSetting[] = [
        {
          id: 'mob_001',
          name: 'Enable Push Notifications',
          description: 'Allow sending push notifications to mobile app users.',
          type: 'toggle',
          value: true,
        },
        {
          id: 'mob_002',
          name: 'App Version',
          description: 'Current version of the mobile application.',
          type: 'input',
          value: '1.0.0',
        },
        {
          id: 'mob_003',
          name: 'App Store Link (iOS)',
          description: 'Link to your app on the Apple App Store.',
          type: 'input',
          value: 'https://apps.apple.com/app/your-app-id',
        },
        {
          id: 'mob_004',
          name: 'Play Store Link (Android)',
          description: 'Link to your app on the Google Play Store.',
          type: 'input',
          value: 'https://play.google.com/store/apps/details?id=your.app.package',
        },
        {
          id: 'mob_005',
          name: 'Update App Content',
          description: 'Trigger an update to refresh in-app content without a full app update.',
          type: 'button',
          actionLabel: 'Trigger Content Update',
          action: () => {
            toast({
              title: 'App content update triggered.',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          },
        },
        {
          id: 'mob_006',
          name: 'Maintenance Mode Message',
          description: 'Message displayed to users when the app is in maintenance mode.',
          type: 'textarea',
          value: 'Our app is currently undergoing maintenance. We will be back shortly!',
        },
      ];
      setMobileSettings(dummyMobileSettings);
      setLoading(false);
      // setError('Failed to load mobile settings.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchMobileSettings();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleChange = (id: string, checked: boolean) => {
    setMobileSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: checked } : setting
      )
    );
    toast({
      title: 'Setting updated.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleInputChange = (id: string, value: string) => {
    setMobileSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: value } : setting
      )
    );
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Mobile settings saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading mobile settings...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Alert status="error" bg="orange.100" color="orange.800">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Flex mb={8} alignItems="center">
        <Heading as="h1" size="xl" color="purple.400">Mobile App Management</Heading>
        <Spacer />
        <Button colorScheme="purple" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {mobileSettings.map((setting) => (
          <Card key={setting.id} bg="gray.800" color="white" shadow="xl" borderRadius="lg">
            <CardHeader>
              <Flex alignItems="center">
                {setting.id === 'mob_001' && <FaBell size="24px" color="#805AD5" />}
                {setting.id === 'mob_002' && <FaMobileAlt size="24px" color="#805AD5" />}
                {setting.id === 'mob_003' && <FaMobileAlt size="24px" color="#805AD5" />}
                {setting.id === 'mob_004' && <FaMobileAlt size="24px" color="#805AD5" />}
                {setting.id === 'mob_005' && <FaUpload size="24px" color="#805AD5" />}
                {setting.id === 'mob_006' && <FaCog size="24px" color="#805AD5" />}
                <Heading size="md" ml={3}>{setting.name}</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.300" mb={4}>{setting.description}</Text>
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel htmlFor={setting.id} mb="0">
                  {setting.name}
                </FormLabel>
                {setting.type === 'toggle' && (
                  <Switch
                    id={setting.id}
                    isChecked={setting.value as boolean}
                    onChange={(e) => handleToggleChange(setting.id, e.target.checked)}
                    colorScheme="purple"
                  />
                )}
                {setting.type === 'input' && (
                  <Input
                    id={setting.id}
                    value={setting.value as string}
                    onChange={(e) => handleInputChange(setting.id, e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    width="auto"
                  />
                )}
                {setting.type === 'textarea' && (
                  <Textarea
                    id={setting.id}
                    value={setting.value as string}
                    onChange={(e) => handleInputChange(setting.id, e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    width="auto"
                  />
                )}
                {setting.type === 'button' && (
                  <Button onClick={setting.action} colorScheme="purple">
                    {setting.actionLabel}
                  </Button>
                )}
              </FormControl>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default AdminMobilePage;