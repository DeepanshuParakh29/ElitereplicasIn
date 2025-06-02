'use client';

import { useState, useEffect, useRef } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { ChakraProvider, Container, Box } from '@chakra-ui/react';
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import CustomCursor from '@/components/CustomCursor';
import { CartProvider } from '@/context/CartContext';
import theme from '@/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Track component mounting state with useRef to avoid hydration mismatches
  const [showSplash, setShowSplash] = useState(false); // Start with false to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const hasMounted = useRef(false);

  // Only show custom cursor and splash screen after component mounts (client-side)
  useEffect(() => {
    // Set mounted state only on client side
    setIsMounted(true);
    hasMounted.current = true;
    
    // Show splash screen only after client-side hydration is complete
    setShowSplash(true);
    
    // Add a class to hide the default cursor
    document.body.classList.add('custom-cursor');
    
    return () => {
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Determine if we're on client or server for initial render
  const isClient = typeof window !== 'undefined';
  
  return (
    <html lang="en">
      <head>
        <style jsx global>{`
          .custom-cursor {
            cursor: none !important;
          }
          
          @media (max-width: 768px) {
            .custom-cursor {
              cursor: auto !important;
            }
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable}`}>
        {/* Only show splash screen after client-side hydration to prevent mismatch */}
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <ChakraProvider theme={theme}>
            <AuthProvider>
              <CartProvider>
                {isMounted && <CustomCursor />}
                <Navbar />
                <Box 
                  as="main" 
                  minH="calc(100vh - 200px)" 
                  py={6}
                  px={4}
                  bg="gray.900"
                >
                  <Container maxW="container.xl">
                    {children}
                  </Container>
                </Box>
                <Footer />
              </CartProvider>
            </AuthProvider>
          </ChakraProvider>
        )}
      </body>
    </html>
  );
}
