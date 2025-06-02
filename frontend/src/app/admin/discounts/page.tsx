'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Input, InputGroup, InputLeftElement, Flex, Spacer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Select, Textarea } from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
}

const AdminDiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching discount data
    const fetchDiscounts = () => {
      const dummyDiscounts: Discount[] = [
        {
          id: 'disc_001',
          code: 'SUMMER20',
          type: 'percentage',
          value: 20,
          minPurchase: 50,
          startDate: '2023-06-01',
          endDate: '2023-08-31',
          isActive: true,
          usageLimit: 100,
          usedCount: 45,
        },
        {
          id: 'disc_002',
          code: 'FREESHIP',
          type: 'fixed',
          value: 0,
          startDate: '2023-01-01',
          endDate: '2024-12-31',
          isActive: true,
        },
        {
          id: 'disc_003',
          code: 'SAVE10',
          type: 'fixed',
          value: 10,
          minPurchase: 75,
          startDate: '2023-07-15',
          endDate: '2023-07-30',
          isActive: false,
          usageLimit: 50,
          usedCount: 50,
        },
      ];
      setDiscounts(dummyDiscounts);
      setLoading(false);
      // setError('Failed to load discounts.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchDiscounts();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDiscount = () => {
    setSelectedDiscount(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteDiscount = (discountId: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      setDiscounts(discounts.filter((d) => d.id !== discountId));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newDiscount: Discount = {
      id: selectedDiscount?.id || `disc_${Date.now()}`,
      code: form.discountCode.value,
      type: form.discountType.value,
      value: parseFloat(form.discountValue.value),
      minPurchase: form.minPurchase.value ? parseFloat(form.minPurchase.value) : undefined,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      isActive: form.isActive.checked,
      usageLimit: form.usageLimit.value ? parseInt(form.usageLimit.value) : undefined,
      usedCount: selectedDiscount?.usedCount || 0,
    };

    if (isEditing) {
      setDiscounts(discounts.map((d) => (d.id === newDiscount.id ? newDiscount : d)));
    } else {
      setDiscounts([...discounts, newDiscount]);
    }
    onClose();
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading discounts...</Text>
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
      <Flex mb={8} alignItems="center">
        <Heading as="h1" size="xl" color="purple.400">Discount Management</Heading>
        <Spacer />
        <Button leftIcon={<FaPlus />} colorScheme="purple" onClick={handleAddDiscount}>
          Add New Discount
        </Button>
      </Flex>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search discounts by code..."
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
        {filteredDiscounts.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Code</Th>
                  <Th color="gray.300">Type</Th>
                  <Th color="gray.300">Value</Th>
                  <Th color="gray.300">Min. Purchase</Th>
                  <Th color="gray.300">Start Date</Th>
                  <Th color="gray.300">End Date</Th>
                  <Th color="gray.300">Active</Th>
                  <Th color="gray.300">Usage</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDiscounts.map((discount) => (
                  <Tr key={discount.id}>
                    <Td>{discount.code}</Td>
                    <Td>{discount.type === 'percentage' ? 'Percentage' : 'Fixed'}</Td>
                    <Td>{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</Td>
                    <Td>{discount.minPurchase ? `$${discount.minPurchase}` : 'N/A'}</Td>
                    <Td>{discount.startDate}</Td>
                    <Td>{discount.endDate}</Td>
                    <Td>{discount.isActive ? 'Yes' : 'No'}</Td>
                    <Td>{discount.usageLimit ? `${discount.usedCount || 0}/${discount.usageLimit}` : 'N/A'}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" mr={2} onClick={() => handleEditDiscount(discount)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteDiscount(discount.id)}>
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
            No discounts found.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>{isEditing ? 'Edit Discount' : 'Add New Discount'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="discount-form" onSubmit={handleSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel>Discount Code</FormLabel>
                <Input name="discountCode" defaultValue={selectedDiscount?.code || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Type</FormLabel>
                <Select name="discountType" defaultValue={selectedDiscount?.type || 'percentage'} bg="gray.800" borderColor="gray.600">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Value</FormLabel>
                <Input name="discountValue" type="number" step="0.01" defaultValue={selectedDiscount?.value || 0} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Minimum Purchase</FormLabel>
                <Input name="minPurchase" type="number" step="0.01" defaultValue={selectedDiscount?.minPurchase || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input name="startDate" type="date" defaultValue={selectedDiscount?.startDate || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>End Date</FormLabel>
                <Input name="endDate" type="date" defaultValue={selectedDiscount?.endDate || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Usage Limit</FormLabel>
                <Input name="usageLimit" type="number" defaultValue={selectedDiscount?.usageLimit || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} display="flex" alignItems="center">
                <FormLabel mb="0" mr="2">Is Active?</FormLabel>
                <input type="checkbox" name="isActive" defaultChecked={selectedDiscount?.isActive || true} />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" type="submit" form="discount-form">
              {isEditing ? 'Update Discount' : 'Create Discount'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminDiscountsPage;