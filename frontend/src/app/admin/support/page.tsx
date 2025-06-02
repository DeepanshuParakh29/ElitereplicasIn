'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, Button, Input, InputGroup, InputLeftElement, Flex, Spacer, Select, Badge, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { FaSearch, FaEye, FaReply, FaCheck, FaTimes } from 'react-icons/fa';

interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdated: string;
  description: string;
  messages: { sender: string; message: string; timestamp: string }[];
}

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    // Simulate fetching ticket data
    const fetchTickets = () => {
      const dummyTickets: Ticket[] = [
        {
          id: 'TKT001',
          subject: 'Product X not working',
          customerName: 'Alice Smith',
          customerEmail: 'alice.s@example.com',
          status: 'open',
          priority: 'high',
          createdAt: '2023-10-20T10:00:00Z',
          lastUpdated: '2023-10-20T10:00:00Z',
          description: 'I received my Product X yesterday and it is not turning on. I have tried charging it but no luck.',
          messages: [
            { sender: 'Alice Smith', message: 'Product X not turning on.', timestamp: '2023-10-20T10:00:00Z' },
          ],
        },
        {
          id: 'TKT002',
          subject: 'Refund request for order ORD005',
          customerName: 'Bob Johnson',
          customerEmail: 'bob.j@example.com',
          status: 'pending',
          priority: 'medium',
          createdAt: '2023-10-19T14:30:00Z',
          lastUpdated: '2023-10-20T09:00:00Z',
          description: 'I would like to request a refund for order ORD005. The item was not as described.',
          messages: [
            { sender: 'Bob Johnson', message: 'Requesting refund for ORD005.', timestamp: '2023-10-19T14:30:00Z' },
            { sender: 'Admin', message: 'Received your request. We are reviewing it.', timestamp: '2023-10-20T09:00:00Z' },
          ],
        },
        {
          id: 'TKT003',
          subject: 'Question about shipping options',
          customerName: 'Charlie Brown',
          customerEmail: 'charlie.b@example.com',
          status: 'closed',
          priority: 'low',
          createdAt: '2023-10-18T11:00:00Z',
          lastUpdated: '2023-10-18T15:00:00Z',
          description: 'Can you tell me more about your expedited shipping options?',
          messages: [
            { sender: 'Charlie Brown', message: 'Shipping options query.', timestamp: '2023-10-18T11:00:00Z' },
            { sender: 'Admin', message: 'Details sent via email.', timestamp: '2023-10-18T15:00:00Z' },
          ],
        },
        {
          id: 'TKT004',
          subject: 'Account login issue',
          customerName: 'Diana Prince',
          customerEmail: 'diana.p@example.com',
          status: 'open',
          priority: 'high',
          createdAt: '2023-10-21T09:00:00Z',
          lastUpdated: '2023-10-21T09:00:00Z',
          description: 'I cannot log into my account. My password is not working.',
          messages: [
            { sender: 'Diana Prince', message: 'Cannot log in.', timestamp: '2023-10-21T09:00:00Z' },
          ],
        },
      ];
      setTickets(dummyTickets);
      setLoading(false);
      // setError('Failed to load tickets.'); // Uncomment to test error state
    };

    const timer = setTimeout(() => {
      fetchTickets();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterPriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPriority(event.target.value);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'green';
      case 'pending':
        return 'orange';
      case 'closed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    onOpen();
  };

  const handleReplyToTicket = () => {
    if (selectedTicket && replyMessage.trim() !== '') {
      const newMessage = {
        sender: 'Admin',
        message: replyMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        lastUpdated: new Date().toISOString(),
        status: 'pending' as Ticket['status'], // Automatically set to pending after admin reply
      };
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      setSelectedTicket(updatedTicket); // Update selected ticket in modal
      setReplyMessage('');
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'closed' as Ticket['status'], lastUpdated: new Date().toISOString() } : ticket
      )
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => prev ? { ...prev, status: 'closed' as Ticket['status'], lastUpdated: new Date().toISOString() } : null);
    }
  };

  if (loading) {
    return (
      <Container centerContent minH="80vh" bg="gray.900" color="white">
        <Spinner size="xl" color="purple.400" />
        <Text mt={4} fontSize="xl">Loading support tickets...</Text>
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
        <Heading as="h1" size="xl" color="purple.400">Support Tickets</Heading>
        <Spacer />
      </Flex>

      <Flex mb={6} wrap="wrap" gap={4}>
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by ID, Subject, Customer Name, or Email..."
            value={searchTerm}
            onChange={handleSearch}
            bg="gray.800"
            borderColor="gray.700"
            color="white"
            _placeholder={{ color: 'gray.500' }}
          />
        </InputGroup>
        <Select
          value={filterStatus}
          onChange={handleFilterStatusChange}
          bg="gray.800"
          borderColor="gray.700"
          color="white"
          width={{ base: '100%', md: 'auto' }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </Select>
        <Select
          value={filterPriority}
          onChange={handleFilterPriorityChange}
          bg="gray.800"
          borderColor="gray.700"
          color="white"
          width={{ base: '100%', md: 'auto' }}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </Flex>

      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl">
        {filteredTickets.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.300">Ticket ID</Th>
                  <Th color="gray.300">Subject</Th>
                  <Th color="gray.300">Customer</Th>
                  <Th color="gray.300">Status</Th>
                  <Th color="gray.300">Priority</Th>
                  <Th color="gray.300">Created</Th>
                  <Th color="gray.300">Last Updated</Th>
                  <Th color="gray.300">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTickets.map((ticket) => (
                  <Tr key={ticket.id}>
                    <Td>{ticket.id}</Td>
                    <Td>{ticket.subject}</Td>
                    <Td>{ticket.customerName}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(ticket.status)}>{ticket.status.toUpperCase()}</Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getPriorityColor(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge>
                    </Td>
                    <Td>{new Date(ticket.createdAt).toLocaleDateString()}</Td>
                    <Td>{new Date(ticket.lastUpdated).toLocaleDateString()}</Td>
                    <Td>
                      <Button size="sm" leftIcon={<FaEye />} colorScheme="blue" mr={2} onClick={() => handleViewTicket(ticket)}>
                        View
                      </Button>
                      {ticket.status !== 'closed' && (
                        <Button size="sm" leftIcon={<FaTimes />} colorScheme="red" onClick={() => handleCloseTicket(ticket.id)}>
                          Close
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No support tickets found matching your criteria.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>Ticket Details: {selectedTicket?.subject}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTicket && (
              <Box>
                <Text mb={2}><b>Ticket ID:</b> {selectedTicket.id}</Text>
                <Text mb={2}><b>Customer:</b> {selectedTicket.customerName} ({selectedTicket.customerEmail})</Text>
                <Text mb={2}><b>Status:</b> <Badge colorScheme={getStatusColor(selectedTicket.status)}>{selectedTicket.status.toUpperCase()}</Badge></Text>
                <Text mb={2}><b>Priority:</b> <Badge colorScheme={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority.toUpperCase()}</Badge></Text>
                <Text mb={2}><b>Created At:</b> {new Date(selectedTicket.createdAt).toLocaleString()}</Text>
                <Text mb={4}><b>Last Updated:</b> {new Date(selectedTicket.lastUpdated).toLocaleString()}</Text>

                <Heading as="h3" size="md" mb={3}>Description:</Heading>
                <Text mb={4}>{selectedTicket.description}</Text>

                <Heading as="h3" size="md" mb={3}>Conversation History:</Heading>
                <Box maxH="300px" overflowY="auto" p={3} bg="gray.800" borderRadius="md" mb={4}>
                  {selectedTicket.messages.map((msg, index) => (
                    <Box key={index} mb={2} p={2} bg={msg.sender === 'Admin' ? 'purple.900' : 'gray.600'} borderRadius="md">
                      <Text fontSize="sm"><b>{msg.sender}</b> <Text as="span" fontSize="xs" color="gray.400">({new Date(msg.timestamp).toLocaleString()})</Text></Text>
                      <Text>{msg.message}</Text>
                    </Box>
                  ))}
                </Box>

                {selectedTicket.status !== 'closed' && (
                  <FormControl mt={4}>
                    <FormLabel>Reply to Customer</FormLabel>
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      bg="gray.800"
                      borderColor="gray.600"
                      color="white"
                    />
                    <Button leftIcon={<FaReply />} colorScheme="purple" mt={3} onClick={handleReplyToTicket}>
                      Send Reply
                    </Button>
                  </FormControl>
                )}
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminSupportPage;