'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Button, useToast, Spinner, Alert, Flex, Spacer, Link } from '@chakra-ui/react';
import { FaBullhorn, FaEnvelope, FaChartLine, FaExternalLinkAlt } from 'react-icons/fa';

interface MarketingTool {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'setup_required';
  configUrl?: string;
  docsUrl?: string;
}

const AdminMarketingPage = () => {
  const [marketingTools, setMarketingTools] = useState<MarketingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching marketing tool data
    const fetchMarketingTools = () => {
      const dummyMarketingTools: MarketingTool[] = [
        {
          id: 'mkt_001',
          name: 'Email Campaigns (Mailchimp)',
          description: 'Manage and send email newsletters and promotional campaigns.',
          status: 'connected',
          configUrl: 'https://mailchimp.com/developer/reference/marketing/',
          docsUrl: 'https://mailchimp.com/developer/reference/marketing/',
        },
        {
          id: 'mkt_002',
          name: 'SEO Optimization',
          description: 'Tools to improve your search engine ranking and visibility.',
          status: 'setup_required',
          configUrl: '/admin/settings/seo',
          docsUrl: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
        },
        {
          id: 'mkt_003',
          name: 'Social Media Management',
          description: 'Connect and manage your social media presence.',
          status: 'disconnected',
          configUrl: '/admin/settings/social',
          docsUrl: 'https://developers.facebook.com/docs/graph-api',
        },
        {
          id: 'mkt_004',
          name: 'Promotional Banners',
          description: 'Create and manage banners for your website homepage and product pages.',
          status: 'connected',
          configUrl: '/admin/ui/banners',
        },
        {
          id: 'mkt_005',
          name: 'Affiliate Program',
          description: 'Set up and manage an affiliate marketing program.',
          status: 'setup_required',
          docsUrl: 'https://www.affiliatemarketing.com/guide',
        },
      ];
      setMarketingTools(dummyMarketingTools);
      setLoading(false);
      // setError('Failed to load marketing tools.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchMarketingTools();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleConnectDisconnect = (id: string, currentStatus: MarketingTool['status']) => {
    setMarketingTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === id
          ? { ...tool, status: currentStatus === 'connected' ? 'disconnected' : 'connected' }
          : tool
      )
    );
    toast({
      title: `Marketing tool ${currentStatus === 'connected' ? 'disconnected' : 'connected'}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading marketing tools...</Text>
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
        <Heading as="h1" size="xl" color="purple.400">Marketing & Promotions</Heading>
        <Spacer />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {marketingTools.map((tool) => (
          <Card key={tool.id} bg="gray.800" color="white" shadow="xl" borderRadius="lg">
            <CardHeader>
              <Flex alignItems="center">
                {tool.id === 'mkt_001' && <FaEnvelope size="24px" color="#805AD5" />}
                {tool.id === 'mkt_002' && <FaChartLine size="24px" color="#805AD5" />}
                {tool.id === 'mkt_003' && <FaBullhorn size="24px" color="#805AD5" />}
                {tool.id === 'mkt_004' && <FaBullhorn size="24px" color="#805AD5" />}
                {tool.id === 'mkt_005' && <FaBullhorn size="24px" color="#805AD5" />}
                <Heading size="md" ml={3}>{tool.name}</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.300" mb={4}>{tool.description}</Text>
              <Text fontSize="sm" color="gray.400">Status: <Text as="span" fontWeight="bold" color={tool.status === 'connected' ? 'green.400' : tool.status === 'disconnected' ? 'red.400' : 'yellow.400'}>{tool.status.replace('_', ' ').toUpperCase()}</Text></Text>
            </CardBody>
            <CardFooter pt={0}>
              <Flex width="100%" justifyContent="flex-end">
                {tool.configUrl && (
                  <Button
                    as={Link}
                    href={tool.configUrl}
                    leftIcon={<FaExternalLinkAlt />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    mr={2}
                  >
                    Configure
                  </Button>
                )}
                {tool.docsUrl && (
                  <Button
                    as={Link}
                    href={tool.docsUrl}
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
                {tool.status !== 'setup_required' && (
                  <Button
                    onClick={() => handleConnectDisconnect(tool.id, tool.status)}
                    colorScheme={tool.status === 'connected' ? 'red' : 'green'}
                    size="sm"
                  >
                    {tool.status === 'connected' ? 'Disconnect' : 'Connect'}
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

export default AdminMarketingPage;