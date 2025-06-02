import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
} as const;

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'whiteAlpha.900',
      },
    },
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  fonts: {
    heading: 'var(--font-playfair-display)',
    body: 'var(--font-inter)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      defaultProps: {
        colorScheme: 'brand',
        size: 'md',
      },
    },
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: { base: 4, md: 6 },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            color: 'whiteAlpha.900',
            '::placeholder': {
              color: 'gray.400',
            },
          },
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.500',
        variant: 'outline', // Ensure the outline variant is used by default
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(14, 165, 233, 0.6)',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  breakpoints: {
    sm: '30em',    // 480px
    md: '48em',    // 768px
    lg: '62em',    // 992px
    xl: '80em',    // 1280px
    '2xl': '96em', // 1536px
  },
});

export default theme;