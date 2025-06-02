'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, BoxProps, keyframes } from '@chakra-ui/react';

// Animation types
export type AnimationType = 
  | 'fade-in' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'scale' 
  | 'rotate' 
  | 'bounce' 
  | 'pulse'
  | 'float'
  | 'shimmer'
  | 'none';

interface AnimatedElementProps extends BoxProps {
  children: React.ReactNode;
  animation: AnimationType;
  delay?: number;
  duration?: number;
  repeat?: number | 'infinite';
  threshold?: number; // Intersection observer threshold
  startOnScroll?: boolean;
  animateOnce?: boolean;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  delay = 0,
  duration = 0.6,
  repeat = 1,
  threshold = 0.1,
  startOnScroll = true,
  animateOnce = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(!startOnScroll);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Define keyframes for animations
  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  const slideUp = keyframes`
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `;

  const slideDown = keyframes`
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `;

  const slideLeft = keyframes`
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `;

  const slideRight = keyframes`
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `;

  const scale = keyframes`
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `;

  const rotate = keyframes`
    from { transform: rotate(-10deg) scale(0.9); opacity: 0; }
    to { transform: rotate(0) scale(1); opacity: 1; }
  `;

  const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  `;

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `;

  // Map animation types to keyframes
  const animationMap = {
    'fade-in': fadeIn,
    'slide-up': slideUp,
    'slide-down': slideDown,
    'slide-left': slideLeft,
    'slide-right': slideRight,
    'scale': scale,
    'rotate': rotate,
    'bounce': bounce,
    'pulse': pulse,
    'float': float,
    'shimmer': shimmer,
    'none': undefined
  };

  // Set up intersection observer for scroll-based animations
  useEffect(() => {
    if (!startOnScroll || !ref.current || (animateOnce && hasAnimated)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (animateOnce) {
            setHasAnimated(true);
            observer.disconnect();
          }
        } else if (!animateOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '10px',
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnScroll, threshold, animateOnce, hasAnimated]);

  // Determine if the animation should be applied
  const shouldAnimate = isVisible && animation !== 'none';

  // Special case for shimmer animation
  const isShimmer = animation === 'shimmer';

  return (
    <Box
      ref={ref}
      position="relative"
      opacity={shouldAnimate || !startOnScroll ? 1 : 0}
      animation={
        shouldAnimate && !isShimmer
          ? `${animationMap[animation]} ${duration}s ${delay}s ${
              repeat === 'infinite' ? 'infinite' : repeat
            } ease-out forwards`
          : undefined
      }
      {...props}
    >
      {children}
      
      {/* Add shimmer effect if selected */}
      {shouldAnimate && isShimmer && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          pointerEvents="none"
          overflow="hidden"
          zIndex={1}
          _after={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            backgroundSize: '200% 100%',
            animation: `${shimmer} ${duration * 2}s ${repeat === 'infinite' ? 'infinite' : repeat} linear`
          }}
        />
      )}
    </Box>
  );
};

export default AnimatedElement;
