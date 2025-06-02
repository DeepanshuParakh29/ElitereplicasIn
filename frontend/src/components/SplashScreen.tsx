'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, Flex, Text, Heading, keyframes, useTheme } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Dynamically import components that should only render on client-side
const ClientOnlyVideo = dynamic(() => Promise.resolve(({ src }: { src: string }) => (
  <video
    autoPlay
    muted
    loop
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  >
    <source src={src} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
)), { ssr: false });

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Use useRef for initial render to prevent hydration mismatch
  const isMounted = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const theme = useTheme();

  // Define animations
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;
  
  const slideUp = keyframes`
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `;
  
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `;

  useEffect(() => {
    // Set mounted flag to true
    isMounted.current = true;
    
    // Staggered animations - only run on client side
    const textTimer = setTimeout(() => {
      if (isMounted.current) setShowText(true);
    }, 800);
    
    const taglineTimer = setTimeout(() => {
      if (isMounted.current) setShowTagline(true);
    }, 1600);
    
    const fadeTimer = setTimeout(() => {
      if (isMounted.current) setIsFadingOut(true);
    }, 4000); // Display for 4 seconds

    const fadeOutTimer = setTimeout(() => {
      if (isMounted.current) {
        setIsVisible(false);
        onFinish();
      }
    }, 5000); // 4 seconds display + 1 second fade out

    return () => {
      isMounted.current = false;
      clearTimeout(textTimer);
      clearTimeout(taglineTimer);
      clearTimeout(fadeTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [onFinish]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="black"
      color="white"
      overflow="hidden"
      transition="opacity 1s ease-in-out"
      opacity={isFadingOut ? 0 : 1}
      zIndex={9999}
    >
      
      {/* Background video with particles effect - only rendered client-side */}
      <Box position="absolute" inset="0" zIndex={10} opacity={0.4}>
        {isMounted.current && <ClientOnlyVideo src="/splash_back.mp4" />}
      </Box>
      
      {/* Animated overlay */}
      <Box 
        position="absolute" 
        inset="0" 
        zIndex={15} 
        bg="rgba(0,0,0,0.2)"
        animation={`${pulse} 4s infinite ease-in-out`}
      />
      
      {/* Content container */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
        zIndex={20}
        textAlign="center"
        p={8}
        bg="rgba(26, 32, 44, 0.7)"
        backdropFilter="blur(8px)"
        borderRadius="xl"
        boxShadow="0 0 40px rgba(128, 90, 213, 0.4)"
        maxWidth="800px"
        transform={showText ? 'scale(1)' : 'scale(0.95)'}
        transition="transform 1s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        {/* Logo with animation */}
        <Box
          position="relative"
          mb={6}
          animation={`${fadeIn} 1s ease-out, ${pulse} 3s infinite ease-in-out`}
        >
          <Image
            src="/Logo.png"
            alt="EliteReplicas.in Logo"
            width={300}
            height={80}
            style={{ objectPosition: 'center' }}
            priority
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            pointerEvents="none"
            bg="transparent"
            sx={{
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 2s infinite linear`
              }
            }}
          />
        </Box>
        
        {/* Main title with animation */}
        <Heading
          as="h1"
          fontSize={{ base: '4xl', md: '6xl' }}
          fontWeight="bold"
          mb={4}
          letterSpacing="wider"
          textTransform="uppercase"
          opacity={showText ? 1 : 0}
          transform={showText ? 'translateY(0)' : 'translateY(30px)'}
          transition="opacity 0.8s ease-out, transform 0.8s ease-out"
          color="purple.400"
          animation={showText ? `${pulse} 3s infinite ease-in-out` : 'none'}
        >
          ELITE REPLICAS
        </Heading>
        
        {/* Tagline with staggered animation */}
        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          color="gray.300"
          maxW="2xl"
          mx="auto"
          opacity={showTagline ? 1 : 0}
          transform={showTagline ? 'translateY(0)' : 'translateY(20px)'}
          transition="opacity 0.8s ease-out, transform 0.8s ease-out"
          lineHeight="tall"
        >
          Discover unparalleled craftsmanship and exquisite detail with Elite Replicas.
          We bring you the finest replicas, meticulously crafted to perfection.
          Experience luxury without compromise.
        </Text>
      </Flex>
    </Box>
  );
};

export default SplashScreen;