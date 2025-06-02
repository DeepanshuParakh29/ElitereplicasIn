'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Card, CardBody, Button, Checkbox, RadioGroup, Radio, Stack, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Input, useToast, Image as ChakraImage } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';

interface CategoryPageProps {
  params: { slug: string };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const router = useRouter();
  const toast = useToast();

  // Safely access the slug parameter
  const slug = params.slug;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    brand: '',
    rating: 0,
    inStock: false,
    gender: '',
  });

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          minPrice: filters.minPrice.toString(),
          maxPrice: filters.maxPrice.toString(),
          ...(filters.brand && { brand: filters.brand }),
          ...(filters.rating > 0 && { rating: filters.rating.toString() }),
          ...(filters.inStock && { inStock: 'true' }),
          ...(filters.gender && { gender: filters.gender }),
        }).toString();
        
        const data = await apiGet<{success: boolean; products: any[]; message?: string}>(PRODUCT_ENDPOINTS.BY_CATEGORY(slug));
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch products');
        }
        
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error loading products.',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, filters, toast]);

  const handlePriceChange = (newValue: number[]) => {
    setFilters({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, brand: event.target.value });
  };

  const handleRatingChange = (value: string) => {
    setFilters({ ...filters, rating: parseInt(value) });
  };

  const handleInStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, inStock: event.target.checked });
  };

  const handleGenderChange = (value: string) => {
    setFilters({ ...filters, gender: value });
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8} textAlign="center">
        <Text fontSize="xl">Loading products...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8} textAlign="center">
        <Text fontSize="xl" color="red.500">Error: {error}</Text>
        <Text fontSize="md" mt={2}>Failed to load products.</Text>
      </Container>
    );
  }

  // Format category name from slug
  const categoryName = slug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      {/* Page-specific dark navigation bar - Placeholder for now */}
      <Box bg="gray.800" py={2} px={4} display="flex" justifyContent="space-between" alignItems="center">
        <Heading as="h6" size="md" color="yellow.400" fontWeight="bold">ELITE REPLICAS</Heading>
        <Box>{/* Menu items will go here */}</Box>
      </Box>
      <Container maxW="container.lg" py={4}>
        {/* Category Header */}
        <Box textAlign="center" mb={6}>
          <Heading as="h1" size="2xl" mb={2} fontFamily="Playfair Display, serif" color="yellow.400" fontWeight="bold">{categoryName}</Heading>
          <Text fontSize="lg" color="gray.400" fontFamily="Inter, sans-serif">Explore our exquisite collection of {categoryName.toLowerCase()}.</Text>
        </Box>

        <Stack direction={{ base: 'column', lg: 'row' }} spacing={8}>
          {/* Sidebar Filter Panel */}
          <Box w={{ base: 'full', lg: '250px' }} p={5} borderRadius="lg" bg="gray.700" color="white">
            <Heading as="h3" size="lg" mb={4}>Filters</Heading>

            {/* Brand Filter */}
            <Box mb={5}>
              <Heading as="h4" size="md" mb={2}>Brand</Heading>
              <Stack spacing={1}>
                {['Rolex', 'Omega', 'Tag Heuer'].map(brand => (
                  <Checkbox
                    key={brand}
                    value={brand}
                    isChecked={filters.brand === brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.checked ? brand : '' })}
                    colorScheme="purple"
                  >
                    {brand}</Checkbox>
                 ))}
               </Stack>
             </Box>

             {/* Price Range Filter */}
             <Box mb={5}>
               <Heading as="h4" size="md" mb={2}>Price Range</Heading>
               <RangeSlider
                 aria-label={['min-price', 'max-price']}
                 min={0}
                 max={5000}
                 step={100}
                 defaultValue={[filters.minPrice, filters.maxPrice]}
                 onChangeEnd={handlePriceChange}
               >
                 <RangeSliderTrack bg="purple.100">
                   <RangeSliderFilledTrack bg="purple.500" />
                 </RangeSliderTrack>
                 <RangeSliderThumb index={0} />
                 <RangeSliderThumb index={1} />
               </RangeSlider>
               <Box display="flex" justifyContent="space-between" color="gray.400">
                 <Text>${filters.minPrice}</Text>
                 <Text>${filters.maxPrice}</Text>
               </Box>
             </Box>

             {/* Gender Filter */}
             <Box>
               <Heading as="h4" size="md" mb={2}>Gender</Heading>
               <RadioGroup onChange={handleGenderChange} value={filters.gender}>
                 <Stack direction="column">
                   {['Men', 'Women', 'Unisex'].map(gender => (
                     <Radio
                       key={gender}
                       value={gender}
                       colorScheme="purple"
                     >
                       {gender}
                     </Radio>
                   ))}
                 </Stack>
               </RadioGroup>
             </Box>
           </Box>

           {/* Product Grid */}
           <Box flex={1}>
             <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
               {products.length === 0 ? (
                 <Box textAlign="center" py={10} gridColumn="1 / -1">
                   <Text fontSize="xl">No products found in this category.</Text>
                   <NextLink href="/shop" passHref legacyBehavior>
                     <Button mt={4} colorScheme="purple">
                       Back to Shop
                     </Button>
                   </NextLink>
                 </Box>
               ) : (
                 products.map((product: any) => (
                   <Card key={product._id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="gray.800" color="white">
                     <Box
                       position="relative"
                       overflow="hidden"
                       transform="scale(1)"
                       transition="transform 0.3s ease-in-out"
                       _hover={{ transform: 'scale(1.1)' }}
                     >
                   <ChakraImage
                      src={product.image}
                      alt={product.name}
                      boxSize="200px"
                      objectFit="cover"
                      mx="auto"
                      mb={4}
                    />
                     </Box>
                     {/* Hover Overlay */}
                     <Box
                       position="absolute"
                       inset={0}
                       bg="rgba(0,0,0,0.5)"
                       display="flex"
                       alignItems="center"
                       justifyContent="center"
                       opacity={0}
                       transition="opacity 0.3s ease-in-out"
                       _hover={{ opacity: 1 }}
                     >
                       <Button colorScheme="yellow" color="black" mr={1}>Quick View</Button>
                       <Button colorScheme="whiteAlpha" color="black">Add to Cart</Button>
                     </Box>
                     <CardBody p={4}>
                       <Heading as="h4" size="md" noOfLines={1} color="white">{product.name}</Heading>
                       <Text fontSize="sm" color="yellow.400">{product.brand}</Text>
                       <Text fontSize="lg" color="yellow.400" mt={1}>${product.price.toFixed(2)}</Text>
                     </CardBody>
                   </Card>
                 ))
               )}
             </SimpleGrid>
           </Box>
         </Stack>

         {/* Pagination */}
         <Box display="flex" justifyContent="center" mt={6}>
           <Button bg="gray.600" color="white" mx={0.5} _hover={{ bg: 'gray.500' }}>Previous</Button>
           <Button bg="yellow.400" color="black" mx={0.5} _hover={{ bg: 'yellow.300' }}>1</Button>
           <Button bg="gray.600" color="white" mx={0.5} _hover={{ bg: 'gray.500' }}>2</Button>
           <Button bg="gray.600" color="white" mx={0.5} _hover={{ bg: 'gray.500' }}>Next</Button>
         </Box>
       </Container>
    </Box>
  );
};

export default CategoryPage;