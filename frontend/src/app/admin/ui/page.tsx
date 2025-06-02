'use client';

import React from 'react';
import { Container, Box, Heading, Text, Button, IconButton, Input, Textarea, Select, Checkbox, RadioGroup, Radio, Stack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Progress, Spinner, Alert, AlertIcon, Badge, Tabs, TabList, TabPanels, TabPanel, Tab, useToast, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Menu, MenuButton, MenuList, MenuItem, Divider, FormControl, FormLabel } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaInfoCircle, FaBell, FaCheck } from 'react-icons/fa';

const AdminUIPage = () => {
  const toast = useToast();
  const [sliderValue, setSliderValue] = React.useState(50);
  const [radioValue, setRadioValue] = React.useState('option1');

  const showToast = (status: 'success' | 'error' | 'warning' | 'info') => {
    toast({
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Toast`,
      description: `This is a ${status} toast message.`,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8} minH="100vh" bg="gray.900" color="white">
      <Heading as="h1" size="xl" mb={8} color="purple.400">UI Component Showcase</Heading>

      {/* Buttons */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Buttons</Heading>
        <Stack direction="row" spacing={4} align="center">
          <Button colorScheme="purple">Primary Button</Button>
          <Button colorScheme="blue" variant="outline">Outline Button</Button>
          <Button colorScheme="red" variant="ghost">Ghost Button</Button>
          <Button colorScheme="teal" size="sm">Small Button</Button>
          <Button colorScheme="green" size="lg">Large Button</Button>
          <IconButton aria-label="Add" icon={<FaPlus />} colorScheme="purple" />
          <Button isLoading loadingText="Submitting" colorScheme="purple" variant="outline">
            Submit
          </Button>
        </Stack>
      </Box>

      {/* Inputs */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Inputs</Heading>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Text Input</FormLabel>
            <Input placeholder="Enter text" bg="gray.700" borderColor="gray.600" />
          </FormControl>
          <FormControl>
            <FormLabel>Password Input</FormLabel>
            <Input type="password" placeholder="Enter password" bg="gray.700" borderColor="gray.600" />
          </FormControl>
          <FormControl>
            <FormLabel>Textarea</FormLabel>
            <Textarea placeholder="Enter long text" bg="gray.700" borderColor="gray.600" />
          </FormControl>
          <FormControl>
            <FormLabel>Select</FormLabel>
            <Select placeholder="Select option" bg="gray.700" borderColor="gray.600">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Checkbox & Radio */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Checkbox & Radio</Heading>
        <Stack spacing={4} direction="row" mb={4}>
          <Checkbox colorScheme="purple" defaultChecked>Remember me</Checkbox>
          <Checkbox colorScheme="purple">Opt-in for emails</Checkbox>
        </Stack>
        <RadioGroup onChange={setRadioValue} value={radioValue}>
          <Stack direction="row">
            <Radio value="option1" colorScheme="purple">First Option</Radio>
            <Radio value="option2" colorScheme="purple">Second Option</Radio>
            <Radio value="option3" colorScheme="purple">Third Option</Radio>
          </Stack>
        </RadioGroup>
      </Box>

      {/* Slider & Progress */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Slider & Progress</Heading>
        <FormControl mb={4}>
          <FormLabel>Slider (Value: {sliderValue})</FormLabel>
          <Slider aria-label="slider-ex-1" defaultValue={50} onChange={(val) => setSliderValue(val)}>
            <SliderTrack bg="gray.600">
              <SliderFilledTrack bg="purple.500" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>
        <FormControl>
          <FormLabel>Progress Bar</FormLabel>
          <Progress value={60} size="md" colorScheme="purple" />
        </FormControl>
      </Box>

      {/* Spinners & Alerts */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Spinners & Alerts</Heading>
        <Stack direction="row" spacing={4} mb={4}>
          <Spinner color="purple.500" />
          <Spinner size="md" color="blue.500" />
          <Spinner size="xl" color="green.500" />
        </Stack>
        <Stack spacing={3}>
          <Alert status="error">
            <AlertIcon />
            There was an error processing your request.
          </Alert>
          <Alert status="success">
            <AlertIcon />
            Data uploaded to the server. Congrats!
          </Alert>
          <Alert status="warning">
            <AlertIcon />
            Seems your account is about to expire!
          </Alert>
          <Alert status="info">
            <AlertIcon />
            Chakra UI is going live on August 1st.
          </Alert>
        </Stack>
      </Box>

      {/* Badges */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Badges</Heading>
        <Stack direction="row" spacing={4}>
          <Badge colorScheme="green">Success</Badge>
          <Badge colorScheme="red">Error</Badge>
          <Badge colorScheme="purple">New</Badge>
          <Badge colorScheme="orange">Warning</Badge>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Tabs</Heading>
        <Tabs colorScheme="purple">
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>Content for Tab One</p>
            </TabPanel>
            <TabPanel>
              <p>Content for Tab Two</p>
            </TabPanel>
            <TabPanel>
              <p>Content for Tab Three</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Toasts */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Toasts</Heading>
        <Stack direction="row" spacing={4}>
          <Button onClick={() => showToast('success')} colorScheme="green">Show Success Toast</Button>
          <Button onClick={() => showToast('error')} colorScheme="red">Show Error Toast</Button>
          <Button onClick={() => showToast('warning')} colorScheme="orange">Show Warning Toast</Button>
          <Button onClick={() => showToast('info')} colorScheme="blue">Show Info Toast</Button>
        </Stack>
      </Box>

      {/* Tooltips & Popovers */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Tooltips & Popovers</Heading>
        <Stack direction="row" spacing={4}>
          <Tooltip label="I am a tooltip" placement="top">
            <Button>Hover me</Button>
          </Tooltip>
          <Popover>
            <PopoverTrigger>
              <Button>Click for Popover</Button>
            </PopoverTrigger>
            <PopoverContent bg="gray.700" borderColor="gray.600">
              <PopoverArrow bg="gray.700" />
              <PopoverCloseButton />
              <PopoverHeader>Popover Title</PopoverHeader>
              <PopoverBody>This is the content of the popover.</PopoverBody>
            </PopoverContent>
          </Popover>
        </Stack>
      </Box>

      {/* Menus */}
      <Box p={6} bg="gray.800" borderRadius="lg" shadow="xl" mb={8}>
        <Heading as="h2" size="lg" mb={4}>Menus</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<FaInfoCircle />} colorScheme="purple">
            Actions
          </MenuButton>
          <MenuList bg="gray.700" borderColor="gray.600">
            <MenuItem _hover={{ bg: 'gray.600' }}>Download</MenuItem>
            <MenuItem _hover={{ bg: 'gray.600' }}>Create a Copy</MenuItem>
            <Divider borderColor="gray.600" />
            <MenuItem _hover={{ bg: 'gray.600' }}>Edit</MenuItem>
            <MenuItem _hover={{ bg: 'gray.600' }}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Container>
  );
};

export default AdminUIPage;