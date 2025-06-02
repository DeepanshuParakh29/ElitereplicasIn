'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Heading, Text, Flex, SimpleGrid } from '@chakra-ui/react';

const AboutPage = () => {
  return (
    <Box minH="100vh" bg="gray.900" color="white" py={8}>
      <Container maxW="container.md" bg="gray.700" p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={8} color="purple.300">
          About EliteReplicas.In
        </Heading>

        <Box fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7} color="gray.300">
          <Text mb={6}>
            Welcome to <Text as="span" fontWeight="semibold" color="purple.200">EliteReplicas.In</Text>, your premier destination for high-quality replica luxury goods. We believe that everyone deserves to experience the elegance and sophistication of premium products without the exorbitant price tag. Our mission is to make luxury accessible, offering meticulously crafted replicas that mirror the original in every detail.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={6} alignItems="center">
            <Flex justify="center">
              <Image
                src="/images/about-us-1.jpg" // Placeholder image
                alt="Our Craftsmanship"
                width={500}
                height={300}
                style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </Flex>
            <Box>
              <Heading as="h2" size="lg" mb={3} color="purple.200">Our Craftsmanship</Heading>
              <Text>
                At EliteReplicas.In, we are committed to unparalleled craftsmanship. Each item in our collection is produced with precision and care, using materials that closely resemble those found in authentic luxury goods. From the stitching on a handbag to the intricate movements of a watch, we pay attention to every minute detail to ensure our replicas are virtually indistinguishable from the originals.
              </Text>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={6} alignItems="center">
            <Flex justify="center" order={{ base: 1, md: 2 }}>
              <Image
                src="/images/about-us-2.jpg" // Placeholder image
                alt="Our Commitment"
                width={500}
                height={300}
                style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </Flex>
            <Box order={{ base: 2, md: 1 }}>
              <Heading as="h2" size="lg" mb={3} color="purple.200">Our Commitment to Quality</Heading>
              <Text>
                Quality is the cornerstone of our business. We rigorously inspect every product to ensure it meets our high standards before it reaches your hands. Our dedication to quality extends to our customer service, where we strive to provide an exceptional shopping experience from browsing to delivery. Your satisfaction is our top priority.
              </Text>
            </Box>
          </SimpleGrid>

          <Text>
            Thank you for choosing EliteReplicas.In. We are proud to offer you a world of luxury that is both exquisite and affordable. Explore our collection and discover your next cherished item today.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;