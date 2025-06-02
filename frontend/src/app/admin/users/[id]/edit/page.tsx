'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Container, Box, Heading, Input, Button, VStack, useToast, Checkbox, FormControl , Spinner, Alert, AlertIcon } from '@chakra-ui/react';

interface ErrorType {
  message: string;
}

const AdminUserEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: userId } = params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real application, fetch user data from your API
        // For now, use dummy data
        const dummyUsers = [
          { _id: 'user123', name: 'John Doe', email: 'john.doe@example.com', isAdmin: true },
          { _id: 'user456', name: 'Jane Smith', email: 'jane.smith@example.com', isAdmin: false },
          { _id: 'user789', name: 'Peter Jones', email: 'peter.jones@example.com', isAdmin: false },
        ];
        const user = dummyUsers.find(u => u._id === userId);

        if (user) {
          setName(user.name);
          setEmail(user.email);
          setIsAdmin(user.isAdmin);
        } else {
          setError(new Error('User not found'));
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, send a PUT request to update the user
      console.log(`Updating user ${userId}:`, { name, email, isAdmin });
      alert('User updated successfully (simulated)!');
      router.push('/admin/users');
    } catch (err: any) {
      setError(err);
    }
  };

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    )
  }

  return (
    <Container maxW="md" py={4}>
      <Box p={4} shadow="md" borderWidth="1px" borderRadius="lg">
        <Heading as="h1" size="xl" mb={4}>
          Edit User
        </Heading>

        <VStack as="form" spacing={4} onSubmit={submitHandler}>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Checkbox
            isChecked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          >
            Is Admin
          </Checkbox>
          <Button type="submit" colorScheme="purple" width="full">
            Update User
          </Button>
        </VStack>
      </Box>
    </Container>
  )
};



export default AdminUserEditPage;