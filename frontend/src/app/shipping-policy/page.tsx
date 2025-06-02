import React from 'react';
import { Container, Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';

const ShippingPolicyPage = () => {
  return (
    <Box bg="gray.900" color="white" py={8}>
      <Container maxW="md" bg="gray.800" p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
          Shipping Policy
        </Heading>

        <Box mt={6} lineHeight={1.6} color="gray.300">
          <Text mb={4}>
            Thank you for visiting and shopping at EliteReplicas.In. The following are the terms and conditions that constitute our Shipping Policy.
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            1. Shipment Processing Time
          </Heading>
          <Text mb={4}>
            All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
          </Text>
          <Text mb={4}>
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            2. Shipping Rates & Delivery Estimates
          </Heading>
          <Text mb={4}>
            Shipping charges for your order will be calculated and displayed at checkout.
          </Text>
          <UnorderedList styleType="disc" pl={5} mb={4}>
            <ListItem><strong>Shipping Method:</strong> Standard Shipping</ListItem>
            <ListItem><strong>Estimated Delivery Time:</strong> 5-7 business days</ListItem>
            <ListItem><strong>Shipping Cost:</strong> [e.g., $5.99 or Free for orders over $50]</ListItem>
          </UnorderedList>
          <Text mb={4}>
            Delivery delays can occasionally occur.
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            3. Shipment Confirmation & Order Tracking
          </Heading>
          <Text mb={4}>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            4. Customs, Duties and Taxes
          </Heading>
          <Text mb={4}>
            EliteReplicas.In is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            5. Damages
          </Heading>
          <Text mb={4}>
            EliteReplicas.In is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            6. International Shipping Policy
          </Heading>
          <Text mb={4}>
            We currently ship to [List of countries or regions, e.g., USA, Canada, UK].
          </Text>

          <Heading as="h2" size="md" mb={3} color="purple.300">
            7. Returns Policy
          </Heading>
          <Text mb={4}>
            Our Return & Refund Policy provides detailed information about options and procedures for returning your order.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default ShippingPolicyPage;