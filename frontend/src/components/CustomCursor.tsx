'use client';

import React, { useState, useEffect } from 'react';
import { Box, keyframes } from '@chakra-ui/react';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isOverLink, setIsOverLink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = window.matchMedia('(max-width: 768px)').matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Only set up cursor if not on mobile
    if (isMobile) return;
    
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      try {
        // Check if cursor is over a clickable element
        const target = e.target as HTMLElement;
        if (!target) return;
        
        const isClickable = (
          target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') !== null || 
          target.closest('button') !== null ||
          target.getAttribute('role') === 'button' ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        
        setIsOverLink(isClickable);
      } catch (error) {
        console.error('Error in cursor tracking:', error);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Don't render anything on mobile devices
  if (isMobile) {
    return null;
  }
  
  return (
    <>
      {/* Main cursor dot */}
      <Box
        position="fixed"
        top="0"
        left="0"
        transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`}
        width={isClicking ? "12px" : isOverLink ? "16px" : "10px"}
        height={isClicking ? "12px" : isOverLink ? "16px" : "10px"}
        borderRadius="full"
        bg={isOverLink ? "purple.400" : "white"}
        opacity={isVisible ? (isClicking ? 0.9 : 0.7) : 0}
        transition="width 0.2s, height 0.2s, opacity 0.2s, background 0.2s"
        zIndex="9999"
        pointerEvents="none"
        mixBlendMode="difference"
        sx={{
          '@media (max-width: 768px)': {
            display: 'none',
          },
        }}
      />

      {/* Outer ring */}
      <Box
        position="fixed"
        top="0"
        left="0"
        transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`}
        width={isClicking ? "30px" : isOverLink ? "40px" : "35px"}
        height={isClicking ? "30px" : isOverLink ? "40px" : "35px"}
        borderRadius="full"
        border="1px solid"
        borderColor={isOverLink ? "purple.300" : "rgba(255, 255, 255, 0.5)"}
        opacity={isVisible ? (isClicking ? 0.9 : 0.5) : 0}
        transition="width 0.3s, height 0.3s, opacity 0.3s, transform 0.1s"
        zIndex="9998"
        pointerEvents="none"
        animation={isOverLink ? `${pulse} 2s infinite` : undefined}
        sx={{
          '@media (max-width: 768px)': {
            display: 'none',
          },
        }}
      />
    </>
  );
};

export default CustomCursor;
