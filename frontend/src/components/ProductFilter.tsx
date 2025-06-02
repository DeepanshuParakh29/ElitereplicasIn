'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  HStack,
  Input,
  Button,
  Divider,
  useColorModeValue,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { FaFilter } from 'react-icons/fa';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ProductFilterProps {
  categories: FilterOption[];
  brands: FilterOption[];
  priceRange: [number, number];
  maxPrice: number;
  onFilterChange: (filters: FilterState) => void;
  isMobile?: boolean;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  search: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  brands,
  priceRange: initialPriceRange,
  maxPrice,
  onFilterChange,
  isMobile = false,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: initialPriceRange,
    search: '',
  });

  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(initialPriceRange);
  const [searchInput, setSearchInput] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    const updatedCategories = isChecked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);

    const newFilters = { ...filters, categories: updatedCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brandId: string, isChecked: boolean) => {
    const updatedBrands = isChecked
      ? [...filters.brands, brandId]
      : filters.brands.filter((id) => id !== brandId);

    const newFilters = { ...filters, brands: updatedBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setTempPriceRange(newRange);
  };

  const handlePriceRangeChangeEnd = (newRange: [number, number]) => {
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: initialPriceRange,
      search: '',
    };
    setFilters(clearedFilters);
    setTempPriceRange(initialPriceRange);
    setSearchInput('');
    onFilterChange(clearedFilters);
  };

  const filterContent = (
    <VStack spacing={6} align="stretch" w="100%">
      {/* Search */}
      <Box>
        <Heading size="sm" mb={3}>
          Search
        </Heading>
        <HStack>
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            onClick={handleSearch}
            colorScheme="purple"
          />
        </HStack>
      </Box>

      <Divider />

      {/* Price Range */}
      <Box>
        <Heading size="sm" mb={3}>
          Price Range
        </Heading>
        <Box px={2}>
          <RangeSlider
            aria-label={['min price', 'max price']}
            min={0}
            max={maxPrice}
            step={10}
            value={tempPriceRange}
            onChange={handlePriceRangeChange}
            onChangeEnd={handlePriceRangeChangeEnd}
            colorScheme="purple"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Flex justify="space-between" mt={2}>
            <Text>${tempPriceRange[0]}</Text>
            <Text>${tempPriceRange[1]}</Text>
          </Flex>
        </Box>
      </Box>

      <Divider />

      {/* Categories */}
      <Accordion allowMultiple defaultIndex={[0]}>
        <AccordionItem border="none">
          <AccordionButton px={0}>
            <Box flex="1" textAlign="left">
              <Heading size="sm">Categories</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={0}>
            <VStack align="start" spacing={2}>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  isChecked={filters.categories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  colorScheme="purple"
                >
                  <Text fontSize="sm">
                    {category.label} {category.count && `(${category.count})`}
                  </Text>
                </Checkbox>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Divider />

      {/* Brands */}
      <Accordion allowMultiple defaultIndex={[0]}>
        <AccordionItem border="none">
          <AccordionButton px={0}>
            <Box flex="1" textAlign="left">
              <Heading size="sm">Brands</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={0}>
            <VStack align="start" spacing={2}>
              {brands.map((brand) => (
                <Checkbox
                  key={brand.id}
                  isChecked={filters.brands.includes(brand.id)}
                  onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
                  colorScheme="purple"
                >
                  <Text fontSize="sm">
                    {brand.label} {brand.count && `(${brand.count})`}
                  </Text>
                </Checkbox>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Divider />

      {/* Clear Filters */}
      <Button
        leftIcon={<CloseIcon />}
        variant="outline"
        colorScheme="red"
        size="sm"
        onClick={handleClearFilters}
      >
        Clear All Filters
      </Button>
    </VStack>
  );

  // Mobile view with drawer
  if (isMobile) {
    return (
      <>
        <Button
          leftIcon={<FaFilter />}
          colorScheme="purple"
          onClick={onOpen}
          mb={4}
          w="full"
        >
          Filter Products
        </Button>

        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Filter Products</DrawerHeader>
            <DrawerBody>
              {filterContent}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop view
  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      shadow="sm"
      position="sticky"
      top="100px"
    >
      <Heading size="md" mb={6}>
        Filter Products
      </Heading>
      {filterContent}
    </Box>
  );
};

export default ProductFilter;