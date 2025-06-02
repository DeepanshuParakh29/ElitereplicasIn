'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  VStack,
  Flex,
  Select,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, ArrowBackIcon } from '@chakra-ui/icons';
import ProductCard from '@/components/ProductCard';
import AnimatedElement from '@/components/AnimatedElement';
import { Product } from '@/types';
import { fetchData } from '@/utils/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchData<Product[]>(`products/search`, { q: query });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use Next.js router to navigate with the search query
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast({
        title: "Search query empty",
        description: "Please enter something to search for",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return products; // Default is relevance, which is the order returned by the API
    }
  };

  const sortedProducts = sortProducts(products);

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <AnimatedElement animation="fade-in" duration={0.5}>
          <VStack spacing={6} align="stretch">
            <AnimatedElement animation="slide-right" duration={0.5}>
              <Button
                as={Link}
                href="/"
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
                mb={4}
                _hover={{ transform: 'translateX(-5px)', transition: 'transform 0.3s' }}
              >
                Back to Home
              </Button>
            </AnimatedElement>
            <Heading as="h1" size="xl" color={headingColor} mb={2}>
              Search Results
            </Heading>
            
            <form onSubmit={handleSearch}>
              <InputGroup size="lg" mb={6}>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="full"
                  bg={useColorModeValue('white', 'gray.800')}
                  borderColor={borderColor}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    size="md"
                    colorScheme="brand"
                    borderRadius="full"
                    type="submit"
                  />
                </InputRightElement>
              </InputGroup>
            </form>
            
            {query && (
              <AnimatedElement animation="slide-up" duration={0.5} delay={0.1}>
                <Text fontSize="lg" mb={4}>
                  {loading ? 'Searching...' : `Found ${products.length} results for "${query}"`}
                </Text>
              </AnimatedElement>
            )}

            {loading ? (
              <Center py={10}>
                <Spinner size="xl" thickness="4px" speed="0.65s" color="brand.500" />
              </Center>
            ) : (
              <>
                {products.length > 0 ? (
                  <>
                    <Flex justify="flex-end" mb={4}>
                      <AnimatedElement animation="fade-in" duration={0.5} delay={0.2}>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          width="200px"
                          borderRadius="md"
                          bg={useColorModeValue('white', 'gray.800')}
                        >
                          <option value="relevance">Relevance</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name-asc">Name: A to Z</option>
                          <option value="name-desc">Name: Z to A</option>
                          <option value="newest">Newest First</option>
                        </Select>
                      </AnimatedElement>
                    </Flex>
                    
                    <Divider mb={6} />
                    
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                      {sortedProducts.map((product, index) => (
                        <AnimatedElement
                          key={product._id}
                          animation="fade-in"
                          duration={0.5}
                          delay={0.1 * (index % 4)}
                        >
                          <ProductCard product={product} />
                        </AnimatedElement>
                      ))}
                    </SimpleGrid>
                  </>
                ) : (
                  query && (
                    <AnimatedElement animation="fade-in" duration={0.5} delay={0.2}>
                      <Alert
                        status="info"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        height="200px"
                        borderRadius="lg"
                      >
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                          No products found
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                          We couldn't find any products matching "{query}". Try different keywords or browse our categories.
                        </AlertDescription>
                      </Alert>
                    </AnimatedElement>
                  )
                )}
              </>
            )}
          </VStack>
        </AnimatedElement>
      </Container>
    </Box>
  );
}
