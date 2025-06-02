'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, GridItem, useBreakpointValue, useToast } from '@chakra-ui/react';
import ProductList from '@/components/ProductList';
import ProductFilter from '@/components/ProductFilter';
import { apiGet } from '@/utils/api';
import { PRODUCT_ENDPOINTS } from '@/config/api';
import { Product } from '@/types';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  search: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: string, label: string, count: number}[]>([]);
  const [brands, setBrands] = useState<{id: string, label: string, count: number}[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const toast = useToast();
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiGet<{success: boolean; products: Product[]; message?: string}>(PRODUCT_ENDPOINTS.ALL);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch products');
        }
        
        const data = response.products;
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories and brands
        const uniqueCategories = [...new Set<string>(data.map(p => p.category))];
        const uniqueBrands = [...new Set<string>(data.map(p => p.brand))];
        
        // Calculate max price (round up to nearest 100)
        const highestPrice = Math.max(...data.map(p => p.price));
        setMaxPrice(Math.ceil(highestPrice / 100) * 100);
        
        // Format categories and brands for filter component
        setCategories(
          uniqueCategories.map((cat: string) => ({
            id: cat,
            label: cat,
            count: data.filter(p => p.category === cat).length,
          }))
        );
        
        setBrands(
          uniqueBrands.map((brand: string) => ({
            id: brand,
            label: brand,
            count: data.filter(p => p.brand === brand).length,
          }))
        );
      } catch (error: any) {
        setError(error.message);
        toast({
          title: 'Error loading products',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const handleFilterChange = (filters: FilterState) => {
    let result = [...products];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((product: any) =>
        filters.categories.includes(product.category)
      );
    }
    
    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter((product: any) =>
        filters.brands.includes(product.brand)
      );
    }
    
    // Filter by price range
    result = result.filter(
      (product: any) =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    setFilteredProducts(result);
  };

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
          <GridItem>
            <ProductFilter
              categories={categories}
              brands={brands}
              priceRange={[0, maxPrice]}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              isMobile={isMobile}
            />
          </GridItem>
          <GridItem>
            <ProductList
              products={filteredProducts}
              isLoading={loading}
              error={error || null}
              title="Our Products"
              emptyMessage="No products match your filter criteria. Try adjusting your filters."
            />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShopPage;