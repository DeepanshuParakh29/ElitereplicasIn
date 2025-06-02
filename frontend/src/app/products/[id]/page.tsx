'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingCart, FaStar, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { apiGet } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';
import {
  Container,
  Box,
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  Flex,
  Badge,
  Image,
  Stack,
  useColorModeValue,
  useToast,
  Divider,
  keyframes,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import AnimatedElement from '../../../components/AnimatedElement';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import ProductDetailSkeleton from '../../../components/ProductDetailSkeleton';
import ProductReviewSection from '../../../components/ProductReviewSection';
import RelatedProducts from '../../../components/RelatedProducts';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { dispatch } = useCart();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const priceColor = useColorModeValue('green.600', 'green.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const metaLabelColor = useColorModeValue('gray.600', 'gray.400');
  const metaValueColor = useColorModeValue('purple.600', 'purple.300');

  // Define animations
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiGet<{success: boolean; product: any; message?: string}>(PRODUCT_ENDPOINTS.DETAIL(productId));
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch product details');
        }
        
        setProduct(response.product);
      } catch (error: any) {
        setError(error);
        toast({
          title: 'Error',
          description: 'Failed to load product details. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity: 1 } });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Product is out of stock',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <Box minH="100vh" py={8} bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xl" color="red.500">Error: {error.message}</Text>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box minH="100vh" py={8} bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xl">Product not found.</Text>
      </Box>
    );
  }

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <AnimatedElement
        animation="slide-right"
        duration={0.5}
        delay={0.2}
        startOnScroll={true}
      >
        <Flex align="center">
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              color={i < Math.floor(rating) ? 'yellow.400' : 'gray.300'}
              mr="1"
              transition="transform 0.2s ease-in-out"
              _hover={{ transform: 'scale(1.2)' }}
            >
              <FaStar />
            </Box>
          ))}
          <Text ml={2} fontSize="sm" color={metaLabelColor}>
            ({product.numReviews} reviews)
          </Text>
        </Flex>
      </AnimatedElement>
    );
  };

  return (
    <Box minH="100vh" py={8} bg={bgColor}>
      <Container maxW="container.xl">
        <Button
          as={Link}
          href="/shop"
          leftIcon={<FaArrowLeft />}
          colorScheme="purple"
          variant="outline"
          mb={4}
          borderRadius="full"
          _hover={{ transform: 'translateX(-5px)' }}
          transition="all 0.3s"
        >
          Back to Shop
        </Button>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} mb={10}>
          {/* Product Image */}
          <GridItem>
            <AnimatedElement
              animation="fade-in"
              duration={0.8}
              startOnScroll={true}
              position="relative"
            >
              <Box
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                shadow="lg"
              >
                <Image
                  src={`/uploads/${product.image}`}
                  alt={product.name}
                  fallbackSrc="https://via.placeholder.com/500"
                  objectFit="cover"
                  width="100%"
                  height="auto"
                  maxH="500px"
                  transition="transform 0.5s ease-in-out"
                  _hover={{ transform: 'scale(1.05)' }}
                />
                <Box
                  position="absolute"
                  top="10px"
                  right="10px"
                  zIndex={2}
                >
                  <Tooltip label="Add to Wishlist" placement="top">
                    <IconButton
                      aria-label="Add to wishlist"
                      icon={<FaHeart />}
                      colorScheme="red"
                      variant="solid"
                      size="md"
                      borderRadius="full"
                      opacity={0.8}
                      _hover={{
                        opacity: 1,
                        transform: 'scale(1.1)',
                        animation: `${pulse} 1s infinite`
                      }}
                    />
                  </Tooltip>
                </Box>
                {product.countInStock <= 0 && (
                  <AnimatedElement
                    animation="pulse"
                    duration={1.5}
                    repeat="infinite"
                    startOnScroll={false}
                    position="absolute"
                    top="10px"
                    left="10px"
                    zIndex={2}
                  >
                    <Badge
                      px="2"
                      py="1"
                      colorScheme="red"
                      fontWeight="bold"
                      fontSize="md"
                      textTransform="uppercase"
                      borderRadius="md"
                    >
                      Out of Stock
                    </Badge>
                  </AnimatedElement>
                )}
              </Box>
            </AnimatedElement>
          </GridItem>

          {/* Product Details */}
          <GridItem>
            <AnimatedElement
              animation="slide-left"
              duration={0.8}
              startOnScroll={true}
            >
              <Box p={6} bg={cardBg} borderRadius="lg" shadow="md">
                <Stack spacing={4}>
                  <AnimatedElement
                    animation="slide-down"
                    duration={0.5}
                    delay={0.1}
                    startOnScroll={true}
                  >
                    <Heading
                      as="h1"
                      size="xl"
                      color={headingColor}
                      position="relative"
                      display="inline-block"
                      _after={{
                        content: '""',
                        position: 'absolute',
                        bottom: '-4px',
                        left: '0',
                        width: '40%',
                        height: '4px',
                        background: headingColor,
                        borderRadius: 'full',
                      }}
                    >
                      {product.name}
                    </Heading>
                  </AnimatedElement>

                  {renderRating(product.rating)}

                  <AnimatedElement
                    animation="slide-right"
                    duration={0.5}
                    delay={0.3}
                    startOnScroll={true}
                  >
                    <Heading
                      as="h2"
                      size="lg"
                      color={priceColor}
                      fontWeight="bold"
                      position="relative"
                      display="inline-block"
                      _hover={{
                        _after: {
                          content: '""',
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          width: '100%',
                          height: '2px',
                          background: priceColor,
                          animation: `${shimmer} 2s infinite linear`,
                          backgroundSize: '200% 100%',
                          backgroundImage: `linear-gradient(90deg, ${priceColor}, transparent, ${priceColor})`,
                        }
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Heading>
                  </AnimatedElement>

                  <AnimatedElement
                    animation="fade-in"
                    duration={0.5}
                    delay={0.4}
                    startOnScroll={true}
                  >
                    <Text color={textColor} lineHeight="1.8">{product.description}</Text>
                  </AnimatedElement>

                  <AnimatedElement
                    animation="slide-up"
                    duration={0.5}
                    delay={0.5}
                    startOnScroll={true}
                  >
                    <Stack spacing={3} p={4} borderWidth="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold" color={metaLabelColor}>Brand:</Text>
                        <Text color={metaValueColor} fontWeight="medium">{product.brand}</Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold" color={metaLabelColor}>Category:</Text>
                        <Text color={metaValueColor} fontWeight="medium">{product.category}</Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold" color={metaLabelColor}>Availability:</Text>
                        <Badge
                          colorScheme={product.countInStock > 0 ? 'green' : 'red'}
                          px={2}
                          py={1}
                          borderRadius="full"
                          animation={product.countInStock <= 0 ? `${pulse} 2s infinite ease-in-out` : 'none'}
                        >
                          {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out Of Stock'}
                        </Badge>
                      </Flex>
                    </Stack>
                  </AnimatedElement>

                  <AnimatedElement
                    animation="slide-up"
                    duration={0.5}
                    delay={0.6}
                    startOnScroll={true}
                  >
                    <Button
                      leftIcon={<FaShoppingCart />}
                      colorScheme="purple"
                      size="lg"
                      width="100%"
                      borderRadius="full"
                      onClick={handleAddToCart}
                      isDisabled={product.countInStock === 0}
                      transition="all 0.2s"
                      position="relative"
                      overflow="hidden"
                      _before={product.countInStock > 0 ? {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease-in-out',
                      } : {}}
                      _hover={product.countInStock > 0 ? {
                        _before: {
                          transform: 'translateX(100%)',
                        },
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                        animation: `${pulse} 2s infinite ease-in-out`,
                      } : {}}
                    >
                      Add to Cart
                    </Button>
                  </AnimatedElement>
                </Stack>
              </Box>
            </AnimatedElement>
          </GridItem>
        </Grid>

        <Divider my={8} borderColor={useColorModeValue('gray.200', 'gray.700')} />

        {/* Product Reviews Section */}
        <AnimatedElement
          animation="fade-in"
          duration={0.8}
          delay={0.8}
          startOnScroll={true}
          threshold={0.1}
        >
          <ProductReviewSection
            productId={productId}
            reviews={product.reviews || []}
            isLoggedIn={isAuthenticated}
          />
        </AnimatedElement>

        <AnimatedElement
          animation="fade-in"
          duration={0.5}
          delay={0.9}
          startOnScroll={true}
        >
          <Divider my={8} borderColor={useColorModeValue('gray.200', 'gray.700')} />
        </AnimatedElement>

        {/* Related Products Section */}
        <AnimatedElement
          animation="fade-in"
          duration={0.8}
          delay={1.0}
          startOnScroll={true}
          threshold={0.1}
        >
          <Heading as="h2" size="lg" mb={6} color={headingColor} textAlign="center">
            Related Products
          </Heading>
          <RelatedProducts
            productId={productId}
            category={product.category}
            limit={4}
          />
        </AnimatedElement>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;