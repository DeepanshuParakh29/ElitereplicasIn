'use client';

import React, { useState } from 'react';
import { Box, Container, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const FAQPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: 'What kind of products does EliteReplicas.In offer?',
      answer: 'EliteReplicas.In specializes in high-quality replica luxury goods, including but not limited to handbags, watches, and accessories. We focus on meticulous craftsmanship to ensure our replicas closely resemble the originals.',
    },
    {
      question: 'How do you ensure the quality of your replicas?',
      answer: 'We are committed to unparalleled craftsmanship. Each item is produced with precision and care, using materials that closely resemble those found in authentic luxury goods. We rigorously inspect every product to ensure it meets our high standards before it reaches your hands.',
    },
    {
      question: 'What is your shipping policy?',
      answer: 'All orders are processed within 2-3 business days. We offer standard shipping with an estimated delivery time of 5-7 business days. Shipping charges are calculated at checkout. You will receive a shipment confirmation email with tracking information once your order has shipped.',
    },
    {
      question: 'What is your return and refund policy?',
      answer: 'We accept returns within [Number] days of the purchase date, provided the items are in new and unused condition with all original tags and labels attached. To initiate a return, please contact our customer service to obtain an RMA number. Refunds are processed after inspection of the returned item.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we currently ship to [List of countries or regions, e.g., USA, Canada, UK]. Please note that customers are responsible for any customs, duties, and taxes applied to their orders.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can contact our customer support team by emailing us at support@elitereplicas.in. We strive to respond to all inquiries as soon as possible.',
    },
    {
      question: 'Are your replicas legal?',
      answer: 'Our products are sold as replicas and are intended for personal use and collection. We operate within legal frameworks concerning the sale of replica goods. Customers are responsible for understanding and complying with local laws regarding the import and ownership of such items.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various secure payment methods, including major credit cards (Visa, MasterCard, American Express) and other online payment solutions. All available payment options will be displayed at checkout.',
    },
  ];

  return (
    <Box minH="100vh" bg="#1a202c" color="white" p={4}>
      <Container maxW="md" bg="#2d3748" p={4} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
          Frequently Asked Questions
        </Heading>

        <Accordion allowToggle>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} mb={2} bg="#4a5568" borderRadius="md" overflow="hidden">
              <h2>
                <AccordionButton
                  _expanded={{ bg: '#6b46c1', color: 'white' }}
                  _hover={{ bg: '#553c9a' }}
                  py={4}
                  px={6}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontSize="lg" fontWeight="semibold">
                      {faq.question}
                    </Text>
                  </Box>
                  <AccordionIcon color="purple.400" />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} borderTop="1px solid #2d3748" px={6}>
                <Text color="#cbd5e0">{faq.answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
};

export default FAQPage;