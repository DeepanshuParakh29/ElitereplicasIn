'use client';

import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Badge,
  Flex,
  Button,
  useColorModeValue,
  useToast,
  keyframes,
} from '@chakra-ui/react';
import AnimatedElement from './AnimatedElement';
import { StarIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    sku?: string;
    stock?: number;
  };
  isCompact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isCompact = false }) => {
  const { dispatch } = useCart();
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const priceColor = useColorModeValue('purple.600', 'purple.300');
  const stockColor = useColorModeValue(
    product.countInStock > 0 ? 'green.500' : 'red.500',
    product.countInStock > 0 ? 'green.300' : 'red.300'
  );
  
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.countInStock > 0) {
      dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity: 1 } });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Product is out of stock',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <AnimatedElement 
      animation="fade-in" 
      duration={0.8} 
      startOnScroll={true}
      threshold={0.1}
      h="100%"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        as={Link}
        href={`/products/${product._id}`}
        maxW={isCompact ? 'sm' : 'md'}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        shadow="md"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
        cursor="pointer"
        h="100%"
        display="flex"
        flexDirection="column"
        position="relative"
        _after={isHovered ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'lg',
          boxShadow: '0 0 15px 2px rgba(128, 90, 213, 0.3)',
          pointerEvents: 'none',
          zIndex: 1,
        } : {}}
      >
        <Box position="relative" overflow="hidden">
          <AnimatedElement
            animation={isHovered ? "pulse" : "none"}
            duration={1.5}
            repeat="infinite"
            startOnScroll={false}
            width="100%"
          >
            <Image
              src={product.image.startsWith('/') ? product.image : `/uploads/${product.image}`}
              alt={product.name}
              height="250px"
              width="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/300?text=Product+Image"
              transition="transform 0.5s ease-in-out"
              transform={isHovered ? "scale(1.05)" : "scale(1)"}
            />
          </AnimatedElement>
          {product.countInStock <= 0 && (
            <AnimatedElement
              animation="pulse"
              duration={1.5}
              repeat="infinite"
              startOnScroll={false}
              position="absolute"
              top="10px"
              right="10px"
              zIndex={2}
            >
              <Badge
                px="2"
                py="1"
                colorScheme="red"
                fontWeight="bold"
                fontSize="xs"
                textTransform="uppercase"
                borderRadius="md"
              >
                Out of Stock
              </Badge>
            </AnimatedElement>
          )}
        </Box>

        <Stack p="4" spacing="3" flex="1" justifyContent="space-between">
          <Box>
            <AnimatedElement
              animation="slide-right"
              duration={0.5}
              delay={0.1}
              startOnScroll={true}
            >
              <Heading as="h3" size={isCompact ? 'sm' : 'md'} color={textColor} noOfLines={2}>
                {product.name}
              </Heading>
            </AnimatedElement>
            {!isCompact && (
              <AnimatedElement
                animation="fade-in"
                duration={0.5}
                delay={0.2}
                startOnScroll={true}
              >
                <Text mt="1" color={textColor} fontSize="sm" noOfLines={2}>
                  {product.description}
                </Text>
              </AnimatedElement>
            )}
          </Box>

          <Box>
            <AnimatedElement
              animation="slide-left"
              duration={0.5}
              delay={0.3}
              startOnScroll={true}
            >
              <Flex align="center" mt="2">
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < Math.floor(product.rating) ? 'yellow.400' : 'gray.300'}
                      mr="1"
                      transition="transform 0.2s ease"
                      transform={i < Math.floor(product.rating) && isHovered ? "scale(1.2)" : "scale(1)"}
                    />
                  ))}
                <Text ml="1" fontSize="sm" color={textColor}>
                  ({product.numReviews} reviews)
                </Text>
              </Flex>
            </AnimatedElement>

            <AnimatedElement
              animation="slide-up"
              duration={0.5}
              delay={0.4}
              startOnScroll={true}
            >
              <Flex justify="space-between" align="center" mt="2">
                <Text 
                  fontWeight="bold" 
                  fontSize={isCompact ? 'lg' : 'xl'} 
                  color={priceColor}
                  position="relative"
                  _after={isHovered ? {
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
                  } : {}}
                >
                  ${product.price.toFixed(2)}
                </Text>
                <Button
                  size={isCompact ? 'sm' : 'md'}
                  colorScheme="purple"
                  leftIcon={<FaShoppingCart />}
                  onClick={handleAddToCart}
                  isDisabled={product.countInStock <= 0}
                  opacity={product.countInStock <= 0 ? 0.6 : 1}
                  _hover={product.countInStock > 0 ? { transform: 'scale(1.05)' } : {}}
                  animation={isHovered && product.countInStock > 0 ? `${pulse} 1.5s infinite ease-in-out` : 'none'}
                >
                  {isCompact ? 'Add' : 'Add to Cart'}
                </Button>
              </Flex>
            </AnimatedElement>

            {!isCompact && (
              <AnimatedElement
                animation="fade-in"
                duration={0.5}
                delay={0.5}
                startOnScroll={true}
              >
                <Flex mt="2" justify="space-between">
                  <Text fontSize="sm" color={textColor}>
                    <Text as="span" fontWeight="semibold">Brand:</Text> {product.brand}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color={stockColor} 
                    fontWeight="semibold"
                    animation={product.countInStock <= 0 ? `${pulse} 2s infinite ease-in-out` : 'none'}
                  >
                    {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                  </Text>
                </Flex>
              </AnimatedElement>
            )}
          </Box>
        </Stack>
      </Box>
    </AnimatedElement>
  );
};

export default ProductCard;