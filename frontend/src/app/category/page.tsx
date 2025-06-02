'use client';

import React from 'react';
import NextLink from 'next/link';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardBody, Image, Button, Link } from '@chakra-ui/react';

const CategoryPage = () => {
  const categories = [
    { name: 'Watches', image: '/images/categories/watches.jpg', description: 'Explore our exquisite collection of replica watches.' },
    { name: 'Handbags', image: '/images/categories/handbags.jpg', description: 'Discover luxury replica handbags for every occasion.' },
    { name: 'Shoes', image: '/images/categories/shoes.jpg', description: 'Step up your style with our premium replica shoes.' },
    { name: 'Accessories', image: '/images/categories/accessories.jpg', description: 'Complete your look with our range of replica accessories.' },
    { name: 'Apparel', image: '/images/categories/apparel.jpg', description: 'Find the latest trends in replica apparel.' },
  ];

  return (
    <Box minH="100vh" bg="#1a202c" color="white" p={4}>
      <Container maxW="container.lg">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="purple.400">
          Shop by Category
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {categories.map((category, index) => (
            <Card key={index} bg="#2d3748" borderRadius="lg" boxShadow="xl" transition="transform 0.3s ease-in-out" _hover={{ transform: 'scale(1.03)' }}>
              <Image
                src={category.image}
                alt={category.name}
                objectFit="cover"
                h="250px"
                w="full"
              />
              <CardBody p={4}>
                <Heading as="h2" size="md" mb={2} color="white">
                  {category.name}
                </Heading>
                <Text color="#cbd5e0" mb={4}>
                  {category.description}
                </Text>
                <Button
                  as={NextLink}
                  href={`/category/${category.name.toLowerCase()}`}
                  colorScheme="purple"
                  borderRadius="full"
                  px={6}
                  py={2}
                  fontWeight="bold"
                >
                  View Products
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default CategoryPage;