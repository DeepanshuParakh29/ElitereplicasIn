'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Input, InputGroup, InputLeftElement, Flex, Spacer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string; // Optional in display, required when creating
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUsers = () => {
      const dummyUsers: User[] = [
        {
          id: 'user_001',
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          username: 'alice_admin',
          role: 'admin',
          status: 'active',
          createdAt: '2023-01-01T10:00:00Z',
        },
        {
          id: 'user_002',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          username: 'bob_user',
          role: 'user',
          status: 'active',
          createdAt: '2023-01-05T11:30:00Z',
        },
        {
          id: 'user_003',
          name: 'Charlie Brown',
          email: 'charlie.brown@example.com',
          username: 'charlie_b',
          role: 'user',
          status: 'inactive',
          createdAt: '2023-01-10T14:00:00Z',
        },
        {
          id: 'user_004',
          name: 'Diana Prince',
          email: 'diana.prince@example.com',
          username: 'diana_editor',
          role: 'editor',
          status: 'active',
          createdAt: '2023-01-12T09:00:00Z',
        },
      ];
      setUsers(dummyUsers);
      setLoading(false);
      // setError('Failed to load users.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newUser: User = {
      id: selectedUser?.id || `user_${Date.now()}`,
      name: form.userName.value,
      email: form.userEmail.value,
      username: form.username.value,
      role: form.userRole.value,
      status: form.userStatus.value,
      createdAt: selectedUser?.createdAt || new Date().toISOString(),
    };

    // Add password if provided (for new users or password updates)
    if (form.password.value) {
      newUser.password = form.password.value;
    }

    if (isEditing) {
      setUsers(users.map((u) => (u.id === newUser.id ? {...u, ...newUser} : u)));
    } else {
      // Ensure new users have a password
      if (!newUser.password) {
        alert('Password is required for new users');
        return;
      }
      setUsers([...users, newUser]);
    }
    onClose();
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading users...</Text>
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
        <Heading as="h1" size="xl" color="purple.400">User Management</Heading>
        <Spacer />
        <Button leftIcon={<FaPlus />} colorScheme="purple" onClick={handleAddUser}>
          Add New User
        </Button>
      </Flex>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search users by name or email..."
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
        {filteredUsers.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Name</Th>
                  <Th color="gray.300">Username</Th>
                  <Th color="gray.300">Email</Th>
                  <Th color="gray.300">Role</Th>
                  <Th color="gray.300">Status</Th>
                  <Th color="gray.300">Created At</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>{user.username}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Td>
                    <Td>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</Td>
                    <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" mr={2} onClick={() => handleEditUser(user)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteUser(user.id)}>
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
            No users found.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>{isEditing ? 'Edit User' : 'Add New User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="user-form" onSubmit={handleSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input name="userName" defaultValue={selectedUser?.name || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Username</FormLabel>
                <Input 
                  name="username" 
                  defaultValue={selectedUser?.username || ''} 
                  bg="gray.800" 
                  borderColor="gray.600" 
                  placeholder="Enter login username"
                />
              </FormControl>
              <FormControl mb={4} isRequired={!isEditing}>
                <FormLabel>{isEditing ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
                <Input 
                  name="password" 
                  type="password" 
                  bg="gray.800" 
                  borderColor="gray.600" 
                  placeholder={isEditing ? 'Leave blank to keep current password' : 'Enter password'}
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="userEmail" type="email" defaultValue={selectedUser?.email || ''} bg="gray.800" borderColor="gray.600" />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Role</FormLabel>
                <Select name="userRole" defaultValue={selectedUser?.role || 'user'} bg="gray.800" borderColor="gray.600">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                </Select>
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Status</FormLabel>
                <Select name="userStatus" defaultValue={selectedUser?.status || 'active'} bg="gray.800" borderColor="gray.600">
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
            <Button colorScheme="purple" type="submit" form="user-form">
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminUsersPage;