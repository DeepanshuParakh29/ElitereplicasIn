'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Button, Switch, FormControl, FormLabel, useToast, Spinner, Alert, Flex, Spacer } from '@chakra-ui/react';
import { FaPlug, FaExternalLinkAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  configUrl?: string;
  docsUrl?: string;
}

const AdminIntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching integration data
    const fetchIntegrations = () => {
      const dummyIntegrations: Integration[] = [
        {
          id: 'int_001',
          name: 'Stripe Payment Gateway',
          description: 'Integrate Stripe for secure and seamless payment processing.',
          status: 'active',
          configUrl: '/admin/settings/payments',
          docsUrl: 'https://stripe.com/docs',
        },
        {
          id: 'int_002',
          name: 'Mailchimp Email Marketing',
          description: 'Connect with Mailchimp to manage email campaigns and subscriber lists.',
          status: 'inactive',
          configUrl: '/admin/settings/marketing',
          docsUrl: 'https://mailchimp.com/developer/reference/marketing/',
        },
        {
          id: 'int_003',
          name: 'Google Analytics',
          description: 'Track website traffic and user behavior with Google Analytics.',
          status: 'pending',
          configUrl: '/admin/settings/analytics',
          docsUrl: 'https://developers.google.com/analytics/devguides/collection/ga4',
        },
        {
          id: 'int_004',
          name: 'Shopify E-commerce Platform',
          description: 'Sync products and orders with your Shopify store.',
          status: 'inactive',
          docsUrl: 'https://shopify.dev/docs',
        },
        {
          id: 'int_005',
          name: 'Slack Notifications',
          description: 'Receive real-time notifications for orders, reviews, and more.',
          status: 'active',
          docsUrl: 'https://api.slack.com/messaging/webhooks',
        },
      ];
      setIntegrations(dummyIntegrations);
      setLoading(false);
      // setError('Failed to load integrations.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchIntegrations();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleStatus = (id: string) => {
    setIntegrations((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === id
          ? { ...integration, status: integration.status === 'active' ? 'inactive' : 'active' }
          : integration
      )
    );
    toast({
      title: 'Integration status updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading integrations...</Text>
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
        <Heading as="h1" size="xl" color="purple.400">Integrations</Heading>
        <Spacer />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {integrations.map((integration) => (
          <Card key={integration.id} bg="gray.800" color="white" shadow="xl" borderRadius="lg">
            <CardHeader>
              <Flex alignItems="center">
                <FaPlug size="24px" color="#805AD5" />
                <Heading size="md" ml={3}>{integration.name}</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.300" mb={4}>{integration.description}</Text>
              <FormControl display="flex" alignItems="center" mb={2}>
                <FormLabel htmlFor={`toggle-${integration.id}`} mb="0">
                  Status: {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </FormLabel>
                <Switch
                  id={`toggle-${integration.id}`}
                  isChecked={integration.status === 'active'}
                  onChange={() => handleToggleStatus(integration.id)}
                  colorScheme="purple"
                  isDisabled={integration.status === 'pending'}
                />
              </FormControl>
            </CardBody>
            <CardFooter pt={0}>
              <Flex width="100%" justifyContent="flex-end">
                {integration.configUrl && (
                  <Button
                    as="a"
                    href={integration.configUrl}
                    leftIcon={<FaExternalLinkAlt />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    mr={2}
                  >
                    Configure
                  </Button>
                )}
                {integration.docsUrl && (
                  <Button
                    as="a"
                    href={integration.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<FaExternalLinkAlt />}
                    colorScheme="teal"
                    variant="ghost"
                    size="sm"
                  >
                    Docs
                  </Button>
                )}
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default AdminIntegrationsPage;