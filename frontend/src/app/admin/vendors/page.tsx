'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Input, InputGroup, InputLeftElement, Flex, Spacer, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching vendor data
    const fetchVendors = () => {
      const dummyVendors: Vendor[] = [
        {
          id: 'vend_001',
          name: 'Tech Innovations Inc.',
          contactPerson: 'John Doe',
          email: 'john.doe@techinnov.com',
          phone: '123-456-7890',
          address: '123 Tech Lane, Innovation City',
          status: 'active',
          createdAt: '2023-01-01T09:00:00Z',
        },
        {
          id: 'vend_002',
          name: 'Gadget Supply Co.',
          contactPerson: 'Jane Smith',
          email: 'jane.smith@gadgetsupply.com',
          phone: '987-654-3210',
          address: '456 Gadget Blvd, Device Town',
          status: 'active',
          createdAt: '2023-01-05T10:30:00Z',
        },
        {
          id: 'vend_003',
          name: 'Audio Solutions Ltd.',
          contactPerson: 'Peter Jones',
          email: 'peter.jones@audiosolutions.com',
          phone: '555-123-4567',
          address: '789 Sound Ave, Harmony City',
          status: 'inactive',
          createdAt: '2023-01-10T14:00:00Z',
        },
      ];
      setVendors(dummyVendors);
      setLoading(false);
      // setError('Failed to load vendors.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchVendors();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter((v) => v.id !== vendorId));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newVendor: Vendor = {
      id: selectedVendor?.id || `vend_${Date.now()}`,
      name: form.vendorName.value,
      contactPerson: form.contactPerson.value,
      email: form.vendorEmail.value,
      phone: form.vendorPhone.value,
      address: form.vendorAddress.value,
      status: form.vendorStatus.value,
      createdAt: selectedVendor?.createdAt || new Date().toISOString(),
    };

    if (isEditing) {
      setVendors(vendors.map((v) => (v.id === newVendor.id ? newVendor : v)));
    } else {
      setVendors([...vendors, newVendor]);
    }
    onClose();
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading vendors...</Text>
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
        <Heading as="h1" size="xl" color="purple.400">Vendor Management</Heading>
        <Spacer />
        <Button leftIcon={<FaPlus />} colorScheme="purple" onClick={handleAddVendor}>
          Add New Vendor
        </Button>
      </Flex>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search vendors by name, contact person, or email..."
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
        {filteredVendors.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Name</Th>
                  <Th color="gray.300">Contact Person</Th>
                  <Th color="gray.300">Email</Th>
                  <Th color="gray.300">Phone</Th>
                  <Th color="gray.300">Status</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredVendors.map((vendor) => (
                  <Tr key={vendor.id}>
                    <Td>{vendor.name}</Td>
                    <Td>{vendor.contactPerson}</Td>
                    <Td>{vendor.email}</Td>
                    <Td>{vendor.phone}</Td>
                    <Td>{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" mr={2} onClick={() => handleEditVendor(vendor)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteVendor(vendor.id)}>
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
            No vendors found.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="vendor-form" onSubmit={handleSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel>Vendor Name</FormLabel>
                <Input name="vendorName" defaultValue={selectedVendor?.name || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Contact Person</FormLabel>
                <Input name="contactPerson" defaultValue={selectedVendor?.contactPerson || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="vendorEmail" type="email" defaultValue={selectedVendor?.email || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input name="vendorPhone" defaultValue={selectedVendor?.phone || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Address</FormLabel>
                <Textarea name="vendorAddress" defaultValue={selectedVendor?.address || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Status</FormLabel>
                <Select name="vendorStatus" defaultValue={selectedVendor?.status || 'active'} bg="gray.800" borderColor="gray.600">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" type="submit" form="vendor-form">
              {isEditing ? 'Update Vendor' : 'Create Vendor'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminVendorsPage;