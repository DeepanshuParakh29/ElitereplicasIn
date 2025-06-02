import React from 'react';
import { Container, Box, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';

const ReturnPolicyPage = () => {
  return (
    <Box bg="gray.900" color="white" py={8}>
      <Container maxW="container.md" bg="gray.800" p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={8} color="purple.400">
          Return & Refund Policy
        </Heading>

        <Box mt={6} fontSize="lg" lineHeight={1.6} color="gray.300">
          <Text mb={4}>
            Thank you for your purchase from EliteReplicas.In. We hope you are happy with your purchase. However, if you are not completely satisfied for any reason, you may return it to us for a full refund or an exchange. Please see below for more information on our return policy.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3} color="purple.300">
            1. Returns
          </Heading>
          <UnorderedList pl={4}>
            <ListItem>All returns must be postmarked within [Number] days of the purchase date.</ListItem>
            <ListItem>All returned items must be in new and unused condition, with all original tags and labels attached.</ListItem>
          </UnorderedList>

          <Heading as="h2" size="md" mt={6} mb={3} color="purple.300">
            2. Return Process
          </Heading>
          <Text mb={4}>
            To return an item, please email customer service at <Link href="mailto:support@elitereplicas.in" color="purple.200" textDecoration="underline">support@elitereplicas.in</Link> to obtain a Return Merchandise Authorization (RMA) number. After receiving an RMA number, place the item securely in its original packaging and include your proof of purchase, and mail your return to the following address:
          </Text>
          <Box ml={4}>
            <Text>EliteReplicas.In</Text>
            <Text>Attn: Returns</Text>
            <Text>[Your Company Address]</Text>
            <Text>[City, State, Zip Code]</Text>
          </Box>
          <Text mt={4} mb={4}>
            Please note, you will be responsible for all return shipping charges. We strongly recommend that you use a trackable method to mail your return.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3} color="purple.300">
            3. Refunds
          </Heading>
          <Text mb={4}>
            After receiving your return and inspecting the condition of your item, we will process your return or exchange. Please allow at least [Number] days from the receipt of your item to process your return or exchange. Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company.
          </Text>
          <Text mb={4}>
            We will notify you by email when your return has been processed.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3} color="purple.300">
            4. Exceptions
          </Heading>
          <UnorderedList pl={4}>
            <ListItem>The following items cannot be returned: [List of non-returnable items, e.g., personalized items, digital downloads].</ListItem>
            <ListItem>For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.</ListItem>
          </UnorderedList>

          <Heading as="h2" size="md" mt={6} mb={3} color="purple.300">
            5. Questions
          </Heading>
          <Text mb={4}>
            If you have any questions concerning our return policy, please contact us at:
            <Link href="mailto:support@elitereplicas.in" color="purple.200" textDecoration="underline">support@elitereplicas.in</Link>.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default ReturnPolicyPage;