'use client';

import React from 'react';
import { Box, Container, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';

const TermsOfServicePage = () => {
  return (
    <Box bg="gray.900" color="white" py={8}>
      <Container maxW="md" bg="gray.800" p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
          Terms of Service
        </Heading>

        <Box mt={6} lineHeight={1.6} color="gray.300">
          <Text mb={4}>
            Welcome to EliteReplicas.In! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms. Please read them carefully.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            1. Acceptance of Terms
          </Heading>
          <Text mb={4}>
            By accessing and using EliteReplicas.In, you accept and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our services.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            2. Use of Our Website
          </Heading>
          <UnorderedList styleType="disc" pl={4}>
            <ListItem>You must be at least 18 years old to use our services.</ListItem>
            <ListItem>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</ListItem>
            <ListItem>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</ListItem>
          </UnorderedList>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            3. Products and Services
          </Heading>
          <UnorderedList styleType="disc" pl={4}>
            <ListItem>We sell replica luxury goods. We strive to provide accurate descriptions and images of our products, but we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.</ListItem>
            <ListItem>All purchases made through EliteReplicas.In are subject to our Return and Refund Policy.</ListItem>
          </UnorderedList>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            4. Pricing and Payment
          </Heading>
          <UnorderedList styleType="disc" pl={4}>
            <ListItem>All prices are listed in [Currency, e.g., USD] and are subject to change without notice.</ListItem>
            <ListItem>We accept various payment methods as indicated on our website. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</ListItem>
          </UnorderedList>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            5. Intellectual Property
          </Heading>
          <Text mb={4}>
            All content on this site, such as text, graphics, logos, images, and software, is the property of EliteReplicas.In or its content suppliers and protected by international copyright laws.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            6. Limitation of Liability
          </Heading>
          <Text mb={4}>
            EliteReplicas.In will not be liable for any damages of any kind arising from the use of this site or from any products purchased from this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            7. Governing Law
          </Heading>
          <Text mb={4}>
            These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            8. Changes to Terms
          </Heading>
          <Text mb={4}>
            We reserve the right to make changes to our site, policies, and these Terms of Service at any time. If any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining condition.
          </Text>

          <Heading as="h2" size="md" color="purple.300" mt={8} mb={3}>
            9. Contact Information
          </Heading>
          <Text mb={4}>
            Questions about the Terms of Service should be sent to us at <Link href="mailto:support@elitereplicas.in" color="purple.200" textDecoration="underline">support@elitereplicas.in</Link>.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfServicePage;