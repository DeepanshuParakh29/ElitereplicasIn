'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button,
  Input, InputGroup, InputLeftElement, Flex, Spacer, Image, useDisclosure, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, Textarea, Select, useToast, SimpleGrid, Card, CardBody,
  Stack, Divider, FormHelperText, Badge, IconButton, Tabs, TabList, Tab, TabPanels,
  TabPanel, VStack, HStack, Progress, Switch, FormErrorMessage, Tooltip, useColorModeValue,
  UnorderedList, ListItem, Icon, Link, Accordion, AccordionItem, AccordionButton, AccordionPanel,
  AccordionIcon, Code
} from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaUpload, FaFileImport, FaFileExcel, FaImage, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  featured?: boolean;
  discount?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  dateAdded?: string;
  variants?: ProductVariant[];
}

interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface FileWithPreview extends File {
  preview?: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [bulkUploadPreview, setBulkUploadPreview] = useState<Product[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const tableBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Clean up image preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImage?.preview) {
        URL.revokeObjectURL(uploadedImage.preview);
      }
    };
  }, [uploadedImage]);

  useEffect(() => {
    // Simulate fetching product data
    const fetchProducts = () => {
      const dummyProducts: Product[] = [
        {
          id: 'prod_001',
          name: 'Elite Gaming Mouse',
          category: 'Electronics',
          price: 79.99,
          stock: 150,
          imageUrl: 'https://via.placeholder.com/50',
          description: 'High-precision gaming mouse with customizable RGB lighting.',
        },
        {
          id: 'prod_002',
          name: 'Mechanical Keyboard Pro',
          category: 'Electronics',
          price: 129.99,
          stock: 80,
          imageUrl: 'https://via.placeholder.com/50',
          description: 'Durable mechanical keyboard with tactile switches.',
        },
        {
          id: 'prod_003',
          name: 'Ultra-Wide Monitor',
          category: 'Electronics',
          price: 399.99,
          stock: 30,
          imageUrl: 'https://via.placeholder.com/50',
          description: 'Immersive ultra-wide monitor for gaming and productivity.',
        },
        {
          id: 'prod_004',
          name: 'Noise-Cancelling Headphones',
          category: 'Audio',
          price: 199.99,
          stock: 120,
          imageUrl: 'https://via.placeholder.com/50',
          description: 'Premium headphones with active noise cancellation.',
        },
      ];
      setProducts(dummyProducts);
      setLoading(false);
      // setError('Failed to load products.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: 'Product deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setBulkUploadFile(file);
      
      // Read and parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Generate preview of products to be imported
        const previewProducts: Product[] = [];
        
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const product: any = {};
          
          headers.forEach((header, index) => {
            const key = header.trim().toLowerCase();
            const value = values[index]?.trim() || '';
            
            if (key === 'id') {
              product.id = value || `prod_${Date.now()}_${i}`;
            } else if (key === 'name') {
              product.name = value;
            } else if (key === 'category') {
              product.category = value;
            } else if (key === 'price') {
              product.price = parseFloat(value) || 0;
            } else if (key === 'stock') {
              product.stock = parseInt(value) || 0;
            } else if (key === 'imageurl') {
              product.imageUrl = value || 'https://via.placeholder.com/50';
            } else if (key === 'description') {
              product.description = value;
            } else if (key === 'sku') {
              product.sku = value;
            } else if (key === 'featured') {
              product.featured = value.toLowerCase() === 'true';
            } else if (key === 'discount') {
              product.discount = parseFloat(value) || 0;
            } else if (key === 'tags') {
              product.tags = value.split(';').map((tag: string) => tag.trim());
            }
          });
          
          // Ensure required fields
          if (product.name && product.category) {
            previewProducts.push(product as Product);
          }
        }
        
        setBulkUploadPreview(previewProducts);
        setIsBulkModalOpen(true);
      };
      
      reader.readAsText(file);
    }
  };
  
  const processBulkUpload = () => {
    if (!bulkUploadFile) return;
    
    setIsBulkUploading(true);
    setBulkUploadProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setBulkUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finalizeBulkUpload();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const finalizeBulkUpload = () => {
    // In a real application, you would process the entire CSV file here
    // For this demo, we'll just add the preview products to our list
    
    // Generate unique IDs for new products
    const newProducts = bulkUploadPreview.map(product => ({
      ...product,
      id: product.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString()
    }));
    
    setProducts([...products, ...newProducts]);
    
    toast({
      title: 'Bulk upload complete',
      description: `Successfully added ${newProducts.length} products`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Reset state
    setIsBulkUploading(false);
    setBulkUploadProgress(0);
    setBulkUploadFile(null);
    setBulkUploadPreview([]);
    setIsBulkModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0] as FileWithPreview;

      // Validate file type
      if (!file.type.match('image.*')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Create preview URL
      file.preview = URL.createObjectURL(file);
      setUploadedImage(file);

      // Simulate upload process
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    // Get image URL (either from uploaded image or from input field)
    // First check if the form element exists before accessing its value
    let imageUrl = '';
    if (form.productImageUrl && form.productImageUrl.value) {
      imageUrl = form.productImageUrl.value;
    } else if (selectedProduct?.imageUrl) {
      // Fallback to the selected product's image URL if available
      imageUrl = selectedProduct.imageUrl;
    } else {
      // Default placeholder image
      imageUrl = 'https://via.placeholder.com/50';
    }
    
    // If there's an uploaded image, use its preview URL
    if (uploadedImage?.preview) {
      // In a real application, you would upload the image to a server/cloud storage
      // and get back a URL. Here we're just using the preview URL for demonstration.
      imageUrl = uploadedImage.preview;
    }

    const newProduct: Product = {
      id: selectedProduct?.id || `prod_${Date.now()}`,
      name: form.productName && form.productName.value ? form.productName.value : '',
      category: form.productCategory && form.productCategory.value ? form.productCategory.value : '',
      price: form.productPrice && form.productPrice.value ? parseFloat(form.productPrice.value) : 0,
      stock: form.productStock && form.productStock.value ? parseInt(form.productStock.value) : 0,
      imageUrl: imageUrl,
      description: form.productDescription && form.productDescription.value ? form.productDescription.value : '',
      sku: form.productSku && form.productSku.value ? form.productSku.value : '',
      featured: form.productFeatured && form.productFeatured.checked ? form.productFeatured.checked : false,
      discount: form.productDiscount && form.productDiscount.value ? parseFloat(form.productDiscount.value) : 0,
      tags: form.productTags && form.productTags.value ? form.productTags.value.split(',').map((tag: string) => tag.trim()) : [],
      dateAdded: new Date().toISOString(),
    };

    if (isEditing) {
      setProducts(products.map((p) => (p.id === newProduct.id ? newProduct : p)));
      toast({
        title: 'Product updated',
        description: `${newProduct.name} has been successfully updated.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setProducts([...products, newProduct]);
      toast({
        title: 'Product added',
        description: `${newProduct.name} has been successfully added.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    // Reset the uploaded image
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setIsUploading(false);
    setUploadProgress(0);

    onClose();
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading products...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Alert status="error" bg="orange.100" color="orange.800">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Flex mb={8} alignItems="center" flexWrap="wrap" gap={4}>
        <Heading as="h1" size="xl" color="purple.400">Product Management</Heading>
        <Spacer />
        <HStack spacing={3}>
          <Button 
            leftIcon={<FaFileImport />} 
            colorScheme="teal" 
            variant="outline"
            onClick={() => csvFileInputRef.current?.click()}
          >
            Bulk Upload
          </Button>
          <Input
            type="file"
            accept=".csv"
            ref={csvFileInputRef}
            onChange={handleBulkUpload}
            display="none"
          />
          <Button leftIcon={<FaPlus />} colorScheme="purple" onClick={handleAddProduct}>
            Add New Product
          </Button>
        </HStack>
      </Flex>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={handleSearch}
            bg="gray.800"
            borderColor="gray.700"
            color="white"
            _placeholder={{ color: 'gray.500' }}
          />
        </InputGroup>
      </Box>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        {filteredProducts.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Image</Th>
                  <Th color="gray.300">Name</Th>
                  <Th color="gray.300">Category</Th>
                  <Th color="gray.300" isNumeric>Price</Th>
                  <Th color="gray.300" isNumeric>Stock</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td><Image src={product.imageUrl} alt={product.name} boxSize="50px" objectFit="cover" borderRadius="md" /></Td>
                    <Td>{product.name}</Td>
                    <Td>{product.category}</Td>
                    <Td isNumeric>${product.price.toFixed(2)}</Td>
                    <Td isNumeric>{product.stock}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" mr={2} onClick={() => handleEditProduct(product)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No products found.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed" index={activeTab} onChange={setActiveTab} mt={4}>
              <TabList mb="1em">
                <Tab>Basic Info</Tab>
                <Tab>Images & Media</Tab>
                <Tab>Inventory & Pricing</Tab>
                <Tab>Additional Details</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form id="product-form" onSubmit={handleSubmit}>
                    <FormControl mb={4} isRequired>
                      <FormLabel>Product Name</FormLabel>
                      <Input name="productName" defaultValue={selectedProduct?.name || ''} />
                    </FormControl>

                    <FormControl mb={4} isRequired>
                      <FormLabel>Category</FormLabel>
                      <Select name="productCategory" defaultValue={selectedProduct?.category || ''}>
                        <option value="Electronics">Electronics</option>
                        <option value="Audio">Audio</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Computers">Computers</option>
                      </Select>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>SKU</FormLabel>
                      <Input name="productSku" defaultValue={selectedProduct?.sku || ''} />
                      <FormHelperText>Unique product identifier</FormHelperText>
                    </FormControl>

                    <FormControl mb={4} isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="productDescription"
                        defaultValue={selectedProduct?.description || ''}
                        minH="150px"
                      />
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>Tags</FormLabel>
                      <Input
                        name="productTags"
                        defaultValue={selectedProduct?.tags?.join(', ') || ''}
                        placeholder="gaming, wireless, premium"
                      />
                      <FormHelperText>Comma-separated list of tags</FormHelperText>
                    </FormControl>

                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel htmlFor="productFeatured" mb="0">
                        Featured Product
                      </FormLabel>
                      <Switch
                        id="productFeatured"
                        name="productFeatured"
                        defaultChecked={selectedProduct?.featured || false}
                        colorScheme="purple"
                      />
                    </FormControl>
                  </form>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <FormLabel>Product Image</FormLabel>
                      <Box
                        borderWidth="2px"
                        borderRadius="md"
                        borderStyle="dashed"
                        borderColor={borderColor}
                        p={6}
                        textAlign="center"
                        cursor="pointer"
                        onClick={() => fileInputRef.current?.click()}
                        position="relative"
                        overflow="hidden"
                      >
                        {uploadedImage?.preview ? (
                          <Box position="relative">
                            <Image
                              src={uploadedImage.preview}
                              alt="Product preview"
                              maxH="200px"
                              mx="auto"
                              borderRadius="md"
                            />
                            <IconButton
                              aria-label="Remove image"
                              icon={<FaTrash />}
                              size="sm"
                              colorScheme="red"
                              position="absolute"
                              top={2}
                              right={2}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (uploadedImage.preview) {
                                  URL.revokeObjectURL(uploadedImage.preview);
                                }
                                setUploadedImage(null);
                              }}
                            />
                          </Box>
                        ) : (
                          <VStack spacing={3}>
                            <Icon as={FaImage} boxSize={12} opacity={0.5} />
                            <Text>Click to upload product image</Text>
                            <Text fontSize="sm" color="gray.500">
                              Supports JPG, PNG, GIF up to 5MB
                            </Text>
                          </VStack>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          display="none"
                        />
                      </Box>
                      {isUploading && (
                        <Box mt={4}>
                          <Text mb={2} fontSize="sm">
                            Uploading: {uploadProgress}%
                          </Text>
                          <Progress value={uploadProgress} size="sm" colorScheme="purple" borderRadius="full" />
                        </Box>
                      )}
                    </Box>

                    <FormControl>
                      <FormLabel>Image URL (alternative to upload)</FormLabel>
                      <Input
                        name="productImageUrl"
                        defaultValue={selectedProduct?.imageUrl || ''}
                        placeholder="https://example.com/image.jpg"
                      />
                      <FormHelperText>Direct link to product image</FormHelperText>
                    </FormControl>

                    {/* Additional media options could be added here */}
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Price ($)</FormLabel>
                      <Input
                        name="productPrice"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.price || ''}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Discount (%)</FormLabel>
                      <Input
                        name="productDiscount"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        defaultValue={selectedProduct?.discount || ''}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Stock Quantity</FormLabel>
                      <Input
                        name="productStock"
                        type="number"
                        defaultValue={selectedProduct?.stock || ''}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Weight (kg)</FormLabel>
                      <Input
                        name="productWeight"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct?.weight || ''}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl mt={6}>
                    <FormLabel>Dimensions (L × W × H cm)</FormLabel>
                    <Input
                      name="productDimensions"
                      placeholder="30 × 20 × 10"
                      defaultValue={selectedProduct?.dimensions || ''}
                    />
                  </FormControl>
                </TabPanel>

                <TabPanel>
                  <Text mb={4}>Additional product details will be added here in the future, such as:</Text>
                  <UnorderedList spacing={2} pl={4}>
                    <ListItem>Product variants (size, color, etc.)</ListItem>
                    <ListItem>Related products</ListItem>
                    <ListItem>Custom fields</ListItem>
                    <ListItem>SEO information</ListItem>
                    <ListItem>Shipping details</ListItem>
                  </UnorderedList>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              form="product-form"
              isLoading={isUploading}
              loadingText="Uploading..."
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Bulk Upload Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            Bulk Upload Products
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isBulkUploading ? (
              <VStack spacing={6} py={8}>
                <Heading size="md">Processing Products</Heading>
                <Progress 
                  value={bulkUploadProgress} 
                  size="lg" 
                  colorScheme="purple" 
                  width="100%" 
                  borderRadius="full" 
                />
                <Text>{bulkUploadProgress}% Complete</Text>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                <Box borderWidth="1px" borderRadius="md" p={4}>
                  <Heading size="sm" mb={2}>File Information</Heading>
                  <Text><strong>Filename:</strong> {bulkUploadFile?.name}</Text>
                  <Text><strong>Size:</strong> {(bulkUploadFile?.size || 0) / 1024 < 1024 ? 
                    `${((bulkUploadFile?.size || 0) / 1024).toFixed(2)} KB` : 
                    `${((bulkUploadFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`}</Text>
                </Box>
                
                <Box>
                  <Heading size="sm" mb={2}>Preview ({Math.min(bulkUploadPreview.length, 5)} of {bulkUploadPreview.length} products)</Heading>
                  {bulkUploadPreview.length > 0 ? (
                    <Box overflowX="auto">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Name</Th>
                            <Th>Category</Th>
                            <Th isNumeric>Price</Th>
                            <Th isNumeric>Stock</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {bulkUploadPreview.slice(0, 5).map((product, index) => (
                            <Tr key={index}>
                              <Td>{product.name}</Td>
                              <Td>{product.category}</Td>
                              <Td isNumeric>${product.price.toFixed(2)}</Td>
                              <Td isNumeric>{product.stock}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ) : (
                    <Text color="red.500">No valid products found in CSV file</Text>
                  )}
                </Box>
                
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          CSV Format Instructions
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text mb={2}>Your CSV file should include the following columns:</Text>
                      <UnorderedList spacing={1} mb={4}>
                        <ListItem><strong>name</strong> (required) - Product name</ListItem>
                        <ListItem><strong>category</strong> (required) - Product category</ListItem>
                        <ListItem><strong>price</strong> (required) - Product price (numeric)</ListItem>
                        <ListItem><strong>stock</strong> (required) - Stock quantity (numeric)</ListItem>
                        <ListItem><strong>imageUrl</strong> - URL to product image</ListItem>
                        <ListItem><strong>description</strong> - Product description</ListItem>
                        <ListItem><strong>sku</strong> - Product SKU</ListItem>
                        <ListItem><strong>featured</strong> - Featured product (true/false)</ListItem>
                        <ListItem><strong>discount</strong> - Discount percentage</ListItem>
                        <ListItem><strong>tags</strong> - Tags separated by semicolons</ListItem>
                      </UnorderedList>
                      
                      <Text mb={2}>Example:</Text>
                      <Code p={2} borderRadius="md" fontSize="xs" whiteSpace="pre-wrap">
                        name,category,price,stock,imageUrl,description,sku,featured,discount,tags<br/>
                        Gaming Mouse,Electronics,49.99,100,https://example.com/mouse.jpg,High precision gaming mouse,GM-001,true,10,gaming;accessories;computer<br/>
                        Wireless Keyboard,Electronics,79.99,50,https://example.com/keyboard.jpg,Wireless mechanical keyboard,WK-002,false,0,keyboard;wireless;office
                      </Code>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button variant="outline" mr={3} onClick={() => setIsBulkModalOpen(false)} isDisabled={isBulkUploading}>
              Cancel
            </Button>
            <Button 
              colorScheme="purple" 
              onClick={processBulkUpload} 
              isLoading={isBulkUploading}
              loadingText="Processing..."
              isDisabled={bulkUploadPreview.length === 0 || isBulkUploading}
            >
              Import Products
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminProductsPage;