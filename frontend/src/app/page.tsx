'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Stack,
  Icon,
  useColorMode,
  AspectRatio,
  Flex,
  Badge,
  SimpleGrid,
  IconButton,
  useBreakpointValue,
  LinkBox,
  LinkOverlay,
  Wrap,
  WrapItem,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaShoppingBag, FaStar, FaTruck, FaShieldAlt } from 'react-icons/fa';
import ProductList from '@/components/ProductList';
import { fetchData } from '@/utils/api';
import { Product } from '@/types';

// Define Category interface locally to ensure it's available
interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

// Create a type for our fallback products to ensure they match the Product interface
type FallbackProduct = Product;

// Define fallback products outside of component to avoid hydration issues
const fallbackProducts: Product[] = [
  {
    _id: '1',
    name: 'Luxury Watch X',
    image: '/images/watches.png',
    price: 299.99,
    rating: 4.8,
    numReviews: 124,
    countInStock: 10,
    description: 'A premium luxury watch replica with exquisite craftsmanship.',
    brand: 'LuxBrand',
    category: 'watches',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Designer Handbag',
    image: '/images/bags.png',
    price: 399.99,
    rating: 4.9,
    numReviews: 89,
    countInStock: 5,
    description: 'An elegant designer handbag replica with premium materials.',
    brand: 'FashionX',
    category: 'bags',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Premium Shoes',
    image: '/images/shoes.png',
    price: 199.99,
    rating: 4.7,
    numReviews: 156,
    countInStock: 15,
    description: 'Comfortable and stylish premium shoes with excellent quality.',
    brand: 'StepStyle',
    category: 'shoes',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: '4',
    name: 'Elegant Jewelry',
    image: '/images/jewelry.png',
    price: 249.99,
    rating: 4.6,
    numReviews: 78,
    countInStock: 8,
    description: 'Beautiful jewelry pieces with stunning designs and premium quality.',
    brand: 'JewelCraft',
    category: 'jewelry',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

// Extended category interface for UI display with icon and link
interface CategoryWithUI {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  link: string;
  image?: string;
  description?: string;
}

const MotionBox = motion(Box);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { colorMode } = useColorMode();
  const slides = [
    {
      image: '/images/luxury.jpg',
      title: 'Luxury Reimagined',
      description: 'Experience the finest quality replicas at unbeatable prices',
      link: '/shop',
      buttonText: 'Shop Collection',
    },
    {
      image: '/images/arrival.png',
      title: 'New Arrivals',
      description: 'Discover our latest collection of premium replicas',
      link: '/shop',
      buttonText: 'View Latest',
    },
    {
      video: '/images/join.mp4',
      image: '/images/join-now.png', // Fallback image for video
      title: 'Join the Elite Replicas Revolution',
      description: 'Time to discover the future of luxury with Elite Replicas.',
      link: 'https://www.instagram.com/elitereplicas.in/',
      buttonText: 'Join Now',
      isVideo: true, // Flag to identify this slide contains video
    },
  ];

  const [categories, setCategories] = useState<CategoryWithUI[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await fetchData<{categories: any[]; success: boolean; message: string}>('/api/categories');
        
        // Debug the response
        console.log('Home page API response:', data);
        
        // Validate response
        if (!data || !data.categories || !Array.isArray(data.categories)) {
          console.warn('Invalid API response format in home page, using fallback data');
          // Set fallback categories here
          setCategoryError('Unable to load categories. Please try again later.');
          return;
        }
        
        // Map API categories to UI categories with icons and links
        const mappedCategories: CategoryWithUI[] = data.categories.map(cat => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          // Map category to appropriate icon or use default
          icon: getCategoryIcon(cat.slug),
          // Create standardized link to category page
          link: `/categories/${cat.slug}`
        }));
        
        setCategories(mappedCategories);
        setCategoryError(null);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategoryError('Unable to load categories. Please try again later.');
        
        // Fallback categories if API fails
        setCategories([
          { _id: '1', name: 'Watches', slug: 'watches', icon: '/icons/watch.svg', link: '/categories/watches' },
          { _id: '2', name: 'Bags', slug: 'bags', icon: '/icons/bag.svg', link: '/categories/bags' },
          { _id: '3', name: 'Shoes', slug: 'shoes', icon: '/icons/shoe.svg', link: '/categories/shoes' },
          { _id: '4', name: 'Jewelry', slug: 'jewelry', icon: '/icons/jewelry.svg', link: '/categories/jewelry' },
          { _id: '5', name: 'Accessories', slug: 'accessories', icon: '/icons/accessory.svg', link: '/categories/accessories' },
          { _id: '6', name: 'Clothing', slug: 'clothing', icon: '/icons/clothing.svg', link: '/categories/clothing' }
        ]);
        
        // Show error toast
        toast({
          title: 'Error loading categories',
          description: 'Using fallback data. Check your connection and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<{products: Product[]; success: boolean; message: string}>('/api/products', { featured: 'true', limit: '4' });
        
        // Debug the response
        console.log('Products API response:', data);
        
        // Validate response
        if (!data || !data.products || !Array.isArray(data.products)) {
          console.warn('Invalid products API response format, using fallback data');
          // Set fallback products
          setFeaturedProducts(fallbackProducts);
          return;
        }
        
        setFeaturedProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        
        // Use the predefined fallback products
        setFeaturedProducts(fallbackProducts);
        
        // Show error toast
        toast({
          title: 'Error loading featured products',
          description: 'Using fallback data. Check your connection and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, [toast]);

  // Helper function to get category icon based on slug
  const getCategoryIcon = (slug: string): string => {
    const iconMap: Record<string, string> = {
      watches: '/icons/watch.svg',
      bags: '/icons/bag.svg',
      shoes: '/icons/shoe.svg',
      jewelry: '/icons/jewelry.svg',
      accessories: '/icons/accessory.svg',
      clothing: '/icons/clothing.svg'
    };
    
    return iconMap[slug] || '/icons/default.svg';
  };

  const benefits = [
    {
      icon: FaTruck,
      title: 'Free Shipping',
      description: 'On orders over Ruppes 2500',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: '100% secure transactions',
    },
    {
      icon: FaStar,
      title: 'Premium Quality',
      description: 'Guaranteed satisfaction',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="gray.900">
      {/* Hero Section */}
      <Box position="relative" h={{ base: '60vh', md: '80vh' }} overflow="hidden">
        {slides.map((slide, index) => (
          <MotionBox
            key={index}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              transition: { duration: 0.8 },
            }}
          >
            <AspectRatio ratio={16 / 9} h="100%">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </AspectRatio>
            <Box
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              bg="blackAlpha.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Container maxW="container.xl">
                <Stack direction="column" gap={6} alignItems="flex-start" color="white">
                  <Heading
                    as="h1"
                    size={{ base: '2xl', md: '4xl' }}
                    fontWeight="bold"
                  >
                    {slide.title}
                  </Heading>
                  <Text fontSize={{ base: 'lg', md: 'xl' }}>
                    {slide.description}
                  </Text>
                  <Button
                    as={Link}
                    href={slide.link}
                    size="lg"
                    colorScheme="brand"
                  >
                    {slide.buttonText}
                  </Button>
                </Stack>
              </Container>
            </Box>
          </MotionBox>
        ))}
        <Flex
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          gap={2}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              w={2}
              h={2}
              borderRadius="full"
              bg={currentSlide === index ? 'white' : 'whiteAlpha.500'}
              cursor="pointer"
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Flex>
      </Box>

      {/* Categories Section */}
      <Container maxW="container.xl" py={16}>
        <Stack gap={12} align="center">
          <Heading textAlign="center">Shop by Category</Heading>
          
          {loadingCategories ? (
            <Flex justify="center" w="full" py={10}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
          ) : categoryError ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {categoryError}
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={{ base: 4, md: 6 }} w="full">
              {categories.map((category) => (
                <LinkBox
                  key={category._id}
                  p={4}
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'md',
                  }}
                >
                  <Stack align="center" gap={4}>
                    <Box position="relative" w={16} h={16}>
                      <Image
                        src={category.icon}
                        alt={category.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </Box>
                    <LinkOverlay as={Link} href={category.link}>
                      <Text fontWeight="medium">{category.name}</Text>
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>

      {/* Benefits Section */}
      <Box bg={colorMode === 'light' ? 'gray.50' : 'gray.900'} py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {benefits.map((benefit) => (
              <Stack
                key={benefit.title}
                gap={4}
                p={6}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                borderRadius="lg"
                boxShadow="sm"
                align="center"
              >
                <Icon as={benefit.icon} boxSize={10} color="brand.500" />
                <Heading size="md">{benefit.title}</Heading>
                <Text textAlign="center" color="gray.500">
                  {benefit.description}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container maxW="container.xl" py={16}>
        <ProductList
          products={featuredProducts}
          isLoading={isLoading}
          title="Featured Products"
          isCompact={true}
          showViewAll={true}
          viewAllLink="/shop"
          emptyMessage="Featured products coming soon!"
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        />
      </Container>
    </Box>
  );
}

