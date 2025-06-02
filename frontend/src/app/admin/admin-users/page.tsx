'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Flex, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, useDisclosure, useToast, InputGroup, InputRightElement,
  IconButton, Badge, Text, Spinner, useColorModeValue, Stack, HStack
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/api';
import { ADMIN_ENDPOINTS } from '@/config/api';

// Define Admin User interface
interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  // Using any type to make it compatible with Chakra UI's FocusableElement
  const initialRef = useRef<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'admin',
    status: 'active'
  });

  // Fetch admin users
  useEffect(() => {
    fetchAdminUsers();
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(adminUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = adminUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, adminUsers]);

  // Fetch admin users from API
  const fetchAdminUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiGet<{success: boolean, users: AdminUser[]}>(ADMIN_ENDPOINTS.USERS);
      if (data.success && data.users) {
        setAdminUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin users',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // No fallback to mock data anymore - we're using the real backend
      setAdminUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for adding a new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'admin',
      status: 'active'
    });
    onOpen();
  };

  // Open modal for editing an existing user
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't populate password field for security
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    onOpen();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.username || !formData.name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // If editing a user and password is empty, remove it from the payload
    const payload: { 
      username: string;
      name: string;
      email: string;
      role: 'admin' | 'superadmin';
      status: 'active' | 'inactive';
      password?: string; // Make password optional
    } = { 
      ...formData,
      role: formData.role as 'admin' | 'superadmin',
      status: formData.status as 'active' | 'inactive'
    };
    
    if (selectedUser && !payload.password) {
      delete payload.password;
    }
    
    try {
      if (selectedUser) {
        // Update existing user
        const data = await apiPut<{success: boolean, user: AdminUser}>(
          ADMIN_ENDPOINTS.USER_DETAIL(selectedUser.id),
          payload
        );
        
        if (data.success) {
          toast({
            title: 'Success',
            description: 'Admin user updated successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Update the user in the list
          setAdminUsers(prev => 
            prev.map(user => {
              if (user.id === selectedUser.id) {
                // Create a properly typed updated user object
                const updatedUser: AdminUser = {
                  ...user,
                  username: payload.username,
                  name: payload.name,
                  email: payload.email,
                  role: payload.role,
                  status: payload.status
                };
                // Only update password if it was provided
                if (payload.password) {
                  updatedUser.password = payload.password;
                }
                return updatedUser;
              }
              return user;
            })
          );
        }
      } else {
        // Create new user
        const data = await apiPost<{success: boolean, user: AdminUser}>(
          ADMIN_ENDPOINTS.USERS,
          payload
        );
        
        if (data.success && data.user) {
          toast({
            title: 'Success',
            description: 'New admin user created successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Add the new user to the list
          setAdminUsers(prev => [...prev, data.user]);
        }
      }
      
      // Close the modal and reset form
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: selectedUser ? 'Failed to update user' : 'Failed to create user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (user: AdminUser) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const data = await apiDelete<{success: boolean}>(
          ADMIN_ENDPOINTS.USER_DETAIL(user.id)
        );
        
        if (data.success) {
          toast({
            title: 'Success',
            description: 'Admin user deleted successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Remove the user from the list
          setAdminUsers(prev => prev.filter(u => u.id !== user.id));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Get status badge color
  const getStatusColor = (status: 'active' | 'inactive'): string => {
    return status === 'active' ? 'green' : 'red';
  };

  // Get role badge color
  const getRoleColor = (role: 'admin' | 'superadmin'): string => {
    return role === 'superadmin' ? 'purple' : 'blue';
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Admin User Management</Heading>
      
      {/* Search and Add User */}
      <Flex mb={4} justifyContent="space-between">
        <InputGroup maxW="300px">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputRightElement>
            <FaSearch color="gray.300" />
          </InputRightElement>
        </InputGroup>
        
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddUser}>
          Add Admin User
        </Button>
      </Flex>
      
      {/* Users Table */}
      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last Login</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.username}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit user"
                          icon={<FaEdit />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEditUser(user)}
                        />
                        <IconButton
                          aria-label="Delete user"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteUser(user)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    <Text>No admin users found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}
      
      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Edit Admin User' : 'Add New Admin User'}
          </ModalHeader>
          <ModalCloseButton />
          
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <FormControl mb={4} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  ref={initialRef}
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              </FormControl>
              
              <FormControl mb={4} isRequired={!selectedUser}>
                <FormLabel>
                  Password {selectedUser && '(leave blank to keep current)'}
                </FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={selectedUser ? "Leave blank to keep current password" : "Enter password"}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      size="sm"
                      variant="ghost"
                      onClick={togglePasswordVisibility}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <FormControl mb={4} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </FormControl>
              
              <FormControl mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </FormControl>
              
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <FormControl mb={4}>
                  <FormLabel>Role</FormLabel>
                  <Select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </Select>
                </FormControl>
                
                <FormControl mb={4}>
                  <FormLabel>Status</FormLabel>
                  <Select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>
            
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                {selectedUser ? 'Update' : 'Create'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
