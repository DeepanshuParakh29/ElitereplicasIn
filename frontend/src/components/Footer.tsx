'use client';

import {
  Box,
  Container,
  Stack,
  Text,
  Link as ChakraLink,
  IconButton,
  Flex,
  Heading,
} from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" borderTop="1px" borderColor="gray.800">
      <Container maxWidth="container.xl" py={12}>
        <Stack spacing={8} direction={{ base: 'column', md: 'row' }} justify="space-between">
          {/* Company Info */}
          <Stack spacing={4} maxW={{ base: '100%', md: '300px' }}>
            <Link href="/">
              <Box>
                <Image src="/Logo.png" alt="EliteReplicas.in Logo" width={180} height={50} />
              </Box>
            </Link>
            <Text fontSize="sm">
              EliteReplicas.in offers the finest quality replica products, blending luxury with affordability. 
              Discover exquisite craftsmanship and timeless designs.
            </Text>
            <Flex gap={4}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebookF />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
                size="sm"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
                size="sm"
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
                size="sm"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedinIn />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
                size="sm"
              />
            </Flex>
          </Stack>

          {/* Quick Links */}
          <Stack spacing={4}>
            <Heading as="h4" size="sm" color="white">
              Quick Links
            </Heading>
            <Stack spacing={2}>
              <Link href="/shop">Shop All</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/returns">Returns & Exchanges</Link>
            </Stack>
          </Stack>

          {/* Categories */}
          <Stack spacing={4}>
            <Heading as="h4" size="sm" color="white">
              Categories
            </Heading>
            <Stack spacing={2}>
              <Link href="/category/watches">Watches</Link>
              <Link href="/category/handbags">Handbags</Link>
              <Link href="/category/shoes">Shoes</Link>
              <Link href="/category/accessories">Accessories</Link>
              <Link href="/category/apparel">Apparel</Link>
            </Stack>
          </Stack>
        </Stack>

        {/* Bottom Bar */}
        <Box borderTopWidth={1} borderStyle="solid" borderColor="gray.800" pt={8} mt={12}>
          <Text textAlign="center" fontSize="sm">
            © {new Date().getFullYear()} EliteReplicas.in. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;