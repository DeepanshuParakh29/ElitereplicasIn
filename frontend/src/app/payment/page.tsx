'use client';

import React, { useState } from 'react';

import { Container, Box, Heading, Button, Input, Grid, GridItem, Flex, RadioGroup, Radio, VStack, useToast, Text, FormControl, FormLabel } from '@chakra-ui/react';

import { FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';


const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with a payment gateway
    console.log('Processing payment with:', selectedMethod);
    if (selectedMethod === 'credit_card') {
      console.log('Card Details:', cardDetails);
      alert('Credit Card Payment Processed!');
    } else {
      alert(`${selectedMethod.replace('_', ' ').toUpperCase()} Payment Initiated!`);
    }
    // Redirect to order confirmation or success page
  };

  // Placeholder for total amount
  const totalAmount = 269.98; // This would typically come from the cart/checkout context

  return (
    <Container maxW="container.lg" minH="100vh" bg="gray.900" color="white" p={4}>
      <Heading as="h1" fontWeight="bold" mb={4} textAlign="center" color="purple.400">
        Payment
      </Heading>

      <Box maxW="container.md" mx="auto" bg="gray.800" p={6} borderRadius="lg" boxShadow="xl">
        <Heading as="h2" size="md" fontWeight="bold" mb={3} color="purple.300" textAlign="center">
          Select Payment Method
        </Heading>

        <Flex justifyContent="center" gap={2} mb={4}>
          <Button
            leftIcon={<FaCreditCard />}
            colorScheme={selectedMethod === 'credit_card' ? 'purple' : 'gray'}
            variant={selectedMethod === 'credit_card' ? 'solid' : 'outline'}
            py={1.5}
            px={3}
            borderRadius="lg"
            onClick={() => setSelectedMethod('credit_card')}
          >
            Credit Card
          </Button>
          <Button
            leftIcon={<FaPaypal />}
            colorScheme={selectedMethod === 'paypal' ? 'purple' : 'gray'}
            variant={selectedMethod === 'paypal' ? 'solid' : 'outline'}
            py={1.5}
            px={3}
            borderRadius="lg"
            onClick={() => setSelectedMethod('paypal')}
          >
            PayPal
          </Button>
          <Button
            leftIcon={<FaApplePay />}
            colorScheme={selectedMethod === 'apple_pay' ? 'purple' : 'gray'}
            variant={selectedMethod === 'apple_pay' ? 'solid' : 'outline'}
            py={1.5}
            px={3}
            borderRadius="lg"
            onClick={() => setSelectedMethod('apple_pay')}
          >
            Apple Pay
          </Button>
        </Flex>

        <Box as="form" onSubmit={handlePaymentSubmit}>
          {selectedMethod === 'credit_card' && (
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <FormLabel color="gray.400">Name on Card</FormLabel>
                  <Input
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardChange}
                    required
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <FormLabel color="gray.400">Card Number</FormLabel>
                  <Input
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    placeholder="**** **** **** ****"
                    required
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel color="gray.400">Expiry Date</FormLabel>
                  <Input
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    required
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel color="gray.400">CVV</FormLabel>
                  <Input
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    required
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}

          {selectedMethod === 'paypal' && (
            <Box textAlign="center" mt={4}>
              <Text mb={2} color="gray.400">
                You will be redirected to PayPal to complete your purchase.
              </Text>
              <Button
                leftIcon={<FaPaypal />}
                colorScheme="blue"
                fontWeight="bold"
                py={1.5}
                px={3}
                borderRadius="lg"
              >
                Pay with PayPal
              </Button>
            </Box>
          )}

          {selectedMethod === 'apple_pay' && (
            <Box textAlign="center" mt={4}>
              <Text mb={2} color="gray.400">
                Click the button below to pay with Apple Pay.
              </Text>
              <Button
                leftIcon={<FaApplePay />}
                bg="black"
                _hover={{ bg: "gray.800" }}
                color="white"
                fontWeight="bold"
                py={1.5}
                px={3}
                borderRadius="lg"
              >
                Pay with Apple Pay
              </Button>
            </Box>
          )}

          <Box mt={6} textAlign="center">
            <Heading as="h3" size="md" color="white" mb={2}>
              Total Amount: ${totalAmount.toFixed(2)}
            </Heading>
            <Button
              type="submit"
              colorScheme="purple"
              fontWeight="bold"
              py={2}
              px={4}
              borderRadius="full"
              mt={2}
              size="lg"
            >
              Complete Payment
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentPage;