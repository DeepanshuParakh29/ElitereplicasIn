'use client';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        size="md"
        borderRadius="full"
      />
    </Tooltip>
  );
};

export default ColorModeToggle;