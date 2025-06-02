'use client';

import React from 'react';
import { Box, Container, Heading, Text, Link, UnorderedList, ListItem } from '@chakra-ui/react';

const PrivacyPolicyPage = () => {
  return (
    <Box minH="100vh" bg="gray.900" color="white" p={4}>
      <Container maxW="md" bg="gray.800" p={4} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
          Privacy Policy
        </Heading>

        <Box sx={{ '& > *:not(style)': { marginBottom: 3 }, fontSize: '1.125rem', lineHeight: 1.75, color: 'gray.300' }}>
          <Text>
            This Privacy Policy describes how EliteReplicas.In ("we," "us," or "our") collects, uses, and discloses your personal information when you visit or make a purchase from our website (the "Site").
          </Text>

          <Heading as="h2" size="lg" mt={4} mb={2} color="purple.300">1. Personal Information We Collect</Heading>
          <Text>
            When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as “Personal Information.” See the list below for more information about what Personal Information we collect and why.
          </Text>
          <UnorderedList styleType="disc" pl={4}>
            <ListItem mb={1}>
              <Text as="span" fontWeight="bold">Device information:</Text>
              <UnorderedList styleType="circle" pl={4}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Examples of Personal Information collected:</Text> version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Purpose of collection:</Text> to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Source of collection:</Text> Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Disclosure for a business purpose:</Text> shared with our processor Shopify.
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem mb={1}>
              <Text as="span" fontWeight="bold">Order information:</Text>
              <UnorderedList styleType="circle" pl={4}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Examples of Personal Information collected:</Text> name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Purpose of collection:</Text> to provide products or services to you to fulfil our contract, to process your payment information, arrange for shipping, and provide you with invoices and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Source of collection:</Text> collected from you.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Disclosure for a business purpose:</Text> shared with our processor Shopify.
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem mb={1}>
              <Text as="span" fontWeight="bold">Customer support information:</Text>
              <UnorderedList styleType="circle" pl={4}>
                <ListItem>
                  <Text as="span" fontWeight="bold">Examples of Personal Information collected:</Text> Name, Email, Phone Number, Order Details.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Purpose of collection:</Text> to provide customer support.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Source of collection:</Text> collected from you.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Disclosure for a business purpose:</Text> [ADD ANY VENDORS YOU USE TO PROVIDE CUSTOMER SUPPORT]
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>

          <Heading as="h2" size="lg" mt={4} mb={2} color="purple.300">2. Sharing Your Personal Information</Heading>
          <Text>
            We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:
          </Text>
          <UnorderedList styleType="disc" pl={4}>
            <ListItem mb={1}>
              <Text as="span">We use Shopify to power our online store—you can read more about how Shopify uses your Personal Information here: <Link href="https://www.shopify.com/legal/privacy" isExternal color="purple.400" _hover={{ textDecoration: 'underline' }}>https://www.shopify.com/legal/privacy</Link>.</Text>
            </ListItem>
            <ListItem mb={1}>
              <Text as="span">We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</Text>
            </ListItem>
          </UnorderedList>

          <Heading as="h2" size="lg" mt={4} mb={2} color="purple.300">3. Your Rights</Heading>
          <Text>
            If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </Text>

          <Heading as="h2" size="lg" mt={4} mb={2} color="purple.300">4. Changes</Heading>
          <Text>
            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
          </Text>

          <Heading as="h2" size="lg" mt={4} mb={2} color="purple.300">5. Contact Us</Heading>
          <Text>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <Link href="mailto:support@elitereplicas.in" color="purple.400" _hover={{ textDecoration: 'underline' }}>support@elitereplicas.in</Link>.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;