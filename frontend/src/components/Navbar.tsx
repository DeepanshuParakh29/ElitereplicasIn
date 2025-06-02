'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Image,
  HStack,
  VStack,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
  keyframes,
  useColorMode,
  Container,
} from '@chakra-ui/react';
import AnimatedElement from './AnimatedElement';
import {
  HamburgerIcon,
  CloseIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaHeart,
  FaStore,
} from 'react-icons/fa';
import ColorModeToggle from './ColorModeToggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Theme colors
  const navBg = useColorModeValue('white', 'gray.800');
  const navColor = useColorModeValue('gray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { state: cartState } = useCart();
  const toast = useToast();

  // State for client-side rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts to enable client-side only features
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('userInfo'); // Remove invalid data
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // Check initial auth status
    checkAuthStatus();

    // Set up event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAuthStatus);

    // Custom event for auth changes within the app
    window.addEventListener('authChange', checkAuthStatus);

    // Check auth status whenever the route changes
    const handleRouteChange = () => {
      checkAuthStatus();
    };

    // Check auth status periodically (every 5 minutes)
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
      clearInterval(interval);
    };
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);

    // Dispatch custom event to notify other components about auth change
    window.dispatchEvent(new Event('authChange'));

    router.push('/login');
  };

  // Define animations
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  const slideDown = keyframes`
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `;

  return (
    <Box position="sticky" top={0} zIndex={1000}>
      <Flex
        bg={navBg}
        color={navColor}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={borderColor}
        align={'center'}
        transition="all 0.3s ease"
        boxShadow="sm"
        animation={`${slideDown} 0.5s ease-out`}
      >
        <Container maxW="container.xl">
          <Flex align="center" justify="space-between">
            {/* Logo */}
            <AnimatedElement animation="rotate" duration={0.8} delay={0.2}>
              <Link href="/">
                <Image
                  src="/Logo.png"
                  alt="Elite Replicas"
                  h="40px"
                  objectFit="contain"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                />
              </Link>
            </AnimatedElement>

            {/* Desktop Navigation */}
            <HStack
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
              alignItems="center"
            >
              {/* Search Bar */}
              <AnimatedElement
                animation="fade-in"
                duration={0.5}
                delay={0.3}
              >
                <InputGroup 
                  maxW="300px"
                  size="md"
                  transition="all 0.3s ease"
                  width={isSearchFocused ? "350px" : "300px"}
                >
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color={isSearchFocused ? accentColor : "gray.400"} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    borderRadius="full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    _focus={{ 
                      borderColor: accentColor, 
                      boxShadow: `0 0 0 1px ${accentColor}`,
                      bg: useColorModeValue('white', 'gray.700')
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Search"
                      icon={<SearchIcon />}
                      size="sm"
                      colorScheme={searchQuery.trim() ? "brand" : "gray"}
                      variant="ghost"
                      borderRadius="full"
                      onClick={() => {
                        if (searchQuery.trim()) {
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
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
              </AnimatedElement>

              {/* Navigation Links */}
              <Button
                as={Link}
                href="/shop"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              >
                Shop
              </Button>
              <Button
                as={Link}
                href="/categories/selection"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              >
                Categories
              </Button>
              <Button
                as={Link}
                href="/about"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              >
                About
              </Button>
              <Button
                as={Link}
                href="/contact"
                variant="ghost"
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              >
                Contact
              </Button>

              {/* Cart Icon with Popover Preview */}
              <Popover trigger="hover" placement="bottom" gutter={10}>
                <PopoverTrigger>
                  <Button
                    as={Link}
                    href="/cart"
                    variant="ghost"
                    borderRadius="full"
                    position="relative"
                    _hover={{ bg: buttonHoverBg }}
                  >
                    <Icon as={FaShoppingCart} boxSize={5} />
                    {isClient && cartState.cartItems.length > 0 && (
                      <Badge
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        colorScheme="red"
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {cartState.cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent width="300px" _focus={{ boxShadow: 'xl' }}>
                  <PopoverArrow />
                  <PopoverBody p={4}>
                    {!isClient || cartState.cartItems.length === 0 ? (
                      <Text textAlign="center">Your cart is empty</Text>
                    ) : (
                      <VStack align="stretch" spacing={3}>
                        <Text fontWeight="bold">Cart ({cartState.cartItems.length} items)</Text>
                        {cartState.cartItems.slice(0, 2).map((item) => (
                          <HStack key={item._id} spacing={3}>
                            <Box position="relative" width="40px" height="40px">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width="40px"
                                height="40px"
                                objectFit="cover"
                                borderRadius="4px"
                              />
                            </Box>
                            <VStack align="start" spacing={0} flex={1}>
                              <Text fontSize="sm" noOfLines={1}>{item.name}</Text>
                              <Text fontSize="xs" color="gray.500">{item.quantity} × ${item.price}</Text>
                            </VStack>
                          </HStack>
                        ))}
                        {cartState.cartItems.length > 2 && (
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            +{cartState.cartItems.length - 2} more items
                          </Text>
                        )}
                        <Button
                          as={Link}
                          href="/cart"
                          colorScheme="brand"
                          size="sm"
                          width="full"
                          mt={2}
                        >
                          View Cart
                        </Button>
                      </VStack>
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Color Mode Toggle */}
              <ColorModeToggle />

              {/* User Menu */}
              {isLoggedIn ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="ghost"
                    cursor="pointer"
                    minW={0}
                    rightIcon={<ChevronDownIcon />}
                    _hover={{ bg: buttonHoverBg }}
                  >
                    <HStack spacing={2}>
                      <Avatar
                        size="sm"
                        name={userInfo?.name || 'User'}
                        src={userInfo?.avatar}
                        bg="brand.500"
                      />
                      <Text display={{ base: 'none', lg: 'block' }}>
                        {userInfo?.name?.split(' ')[0] || 'User'}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FaUser />} as={Link} href="/user/profile">
                      My Profile
                    </MenuItem>
                    <MenuItem icon={<FaClipboardList />} as={Link} href="/user/profile/orders">
                      My Orders
                    </MenuItem>
                    <MenuItem icon={<FaHeart />} as={Link} href="/user/profile/wishlist">
                      Wishlist
                    </MenuItem>
                    {userInfo?.isAdmin && (
                      <MenuItem icon={<FaStore />} as={Link} href="/admin/dashboard">
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuDivider />
                    <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                pathname !== '/login' && (
                  <HStack spacing={2}>
                    <Button
                      as={Link}
                      href="/signup"
                      variant="ghost"
                      borderRadius="full"
                      size="md"
                    >
                      Sign Up
                    </Button>
                    <Button
                      as={Link}
                      href="/login"
                      colorScheme="brand"
                      borderRadius="full"
                      size="md"
                    >
                      Login
                    </Button>
                  </HStack>
                )
              )}
            </HStack>

            {/* Mobile Navigation */}
            <AnimatedElement animation="fade-in" duration={0.5} delay={0.8}>
              <Flex display={{ base: 'flex', md: 'none' }}>
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                  }
                  variant={'ghost'}
                  aria-label={'Toggle Navigation'}
                  _hover={{ transform: 'rotate(10deg)' }}
                  transition="transform 0.3s ease"
                />
              </Flex>
            </AnimatedElement>
          </Flex>
        </Container>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box animation={isOpen ? `${fadeIn} 0.5s ease-out` : undefined}>
          <VStack spacing={4} align="stretch">
            <AnimatedElement
              animation="fade-in"
              duration={0.5}
              delay={0.2}
            >
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={isSearchFocused ? accentColor : "gray.400"} />
                </InputLeftElement>
                <Input
                  placeholder="Search products..."
                  borderRadius="full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  _focus={{ 
                    borderColor: accentColor, 
                    boxShadow: `0 0 0 1px ${accentColor}`,
                    bg: useColorModeValue('white', 'gray.700')
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      onToggle(); // Close mobile menu after search
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    size="sm"
                    colorScheme={searchQuery.trim() ? "brand" : "gray"}
                    variant="ghost"
                    borderRadius="full"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        onToggle(); // Close mobile menu after search
                      } else {
                        toast({
                          title: "Search query empty",
                          description: "Please enter something to search for",
                          status: "info",
                          duration: 2000,
                          isClosable: true,
                        });
                      }
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </AnimatedElement>

            <Button
              as={Link}
              href="/shop"
              w="full"
              variant="ghost"
              justifyContent="flex-start"
              borderRadius="md"
            >
              Shop
            </Button>
            <Button
              as={Link}
              href="/categories/selection"
              w="full"
              variant="ghost"
              justifyContent="flex-start"
              borderRadius="md"
            >
              Categories
            </Button>
            <Button
              as={Link}
              href="/about"
              w="full"
              variant="ghost"
              justifyContent="flex-start"
              borderRadius="md"
            >
              About
            </Button>
            <Button
              as={Link}
              href="/contact"
              w="full"
              variant="ghost"
              justifyContent="flex-start"
              borderRadius="md"
            >
              Contact
            </Button>
            <Button
              as={Link}
              href="/cart"
              w="full"
              variant="ghost"
              justifyContent="flex-start"
              borderRadius="md"
            >
              <HStack width="100%" justifyContent="space-between">
                <Text>Cart</Text>
                {isClient && cartState.cartItems.length > 0 && (
                  <Badge colorScheme="red" borderRadius="full">
                    {cartState.cartItems.length}
                  </Badge>
                )}
              </HStack>
            </Button>
            
            {isLoggedIn ? (
              <VStack align="stretch" spacing={2}>
                <Button
                  as={Link}
                  href="/user/profile"
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<FaUser />}
                  borderRadius="md"
                >
                  My Profile
                </Button>
                <Button
                  as={Link}
                  href="/user/profile/orders"
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<FaClipboardList />}
                  borderRadius="md"
                >
                  My Orders
                </Button>
                <Button
                  as={Link}
                  href="/user/profile/wishlist"
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<FaHeart />}
                  borderRadius="md"
                >
                  Wishlist
                </Button>
                {userInfo?.isAdmin && (
                  <Button
                    as={Link}
                    href="/admin/dashboard"
                    w="full"
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={<FaStore />}
                    borderRadius="md"
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button 
                  w="full" 
                  variant="outline" 
                  colorScheme="red" 
                  justifyContent="flex-start" 
                  leftIcon={<FaSignOutAlt />}
                  onClick={handleLogout}
                  borderRadius="md"
                  mt={2}
                >
                  Logout
                </Button>
              </VStack>
            ) : (
              <VStack spacing={2}>
                <Button
                  as={Link}
                  href="/login"
                  w="full"
                  colorScheme="brand"
                  borderRadius="md"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/signup"
                  w="full"
                  variant="outline"
                  borderRadius="md"
                >
                  Sign Up
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;