'use client';

import React, { useState } from 'react';
import { Box, Container, Heading, Text, Input, Textarea, Button, FormControl, FormLabel } from '@chakra-ui/react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white" py={4}>
      <Container maxW="sm" bg="gray.700" p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.300">
          Contact Us
        </Heading>

        <Text textAlign="center" mb={6} color="gray.300">
          Have a question, comment, or suggestion? We'd love to hear from you! Please fill out the form below, and we'll get back to you as soon as possible.
        </Text>

        <Box as="form" onSubmit={handleSubmit}>
          <FormControl id="name" mb={4} isRequired>
            <FormLabel color="gray.300">Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
              color="white"
            />
          </FormControl>

          <FormControl id="email" mb={4} isRequired>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@example.com"
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
              color="white"
            />
          </FormControl>

          <FormControl id="subject" mb={4} isRequired>
            <FormLabel color="gray.300">Subject</FormLabel>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject of your message"
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
              color="white"
            />
          </FormControl>

          <FormControl id="message" mb={6} isRequired>
            <FormLabel color="gray.300">Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={6}
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
              color="white"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            width="full"
            _hover={{ bg: 'purple.600' }}
          >
            Send Message
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;