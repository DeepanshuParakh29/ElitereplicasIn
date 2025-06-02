import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, useToast, Progress, Box, Text, Link as ChakraLink } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { ADMIN_ENDPOINTS } from '@/config/api';
import { API_BASE_URL } from '@/config/api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected.',
        description: 'Please select an Excel or CSV file to upload.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Simulate upload progress
    let progress = 0;
    let interval: NodeJS.Timeout | undefined;
    
    try {
      interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 200);

      const response = await fetch(`${API_BASE_URL}${ADMIN_ENDPOINTS.PRODUCTS}/bulk-upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Upload successful.',
          description: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Upload failed.',
          description: data.message || 'An error occurred during upload.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      clearInterval(interval);
      setUploadProgress(0);
      toast({
        title: 'Upload error.',
        description: error.message || 'Could not connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setUploading(false);
    setSelectedFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.700" color="white">
        <ModalHeader>Bulk Upload Products</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>Please download the template and fill in the product details. Then upload the file here.</Text>
          <ChakraLink href="/sample_product_template.csv" download="sample_product_template.csv" style={{ textDecoration: 'none' }}>
            <Button leftIcon={<DownloadIcon />} colorScheme="purple" variant="outline" mb={4}>
              Download Template
            </Button>
          </ChakraLink>
          <FormControl>
            <FormLabel>Upload File (CSV/Excel)</FormLabel>
            <Input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              p={1}
              border="1px solid"
              borderColor="gray.600"
              borderRadius="md"
            />
          </FormControl>
          {uploading && (
            <Box mt={4}>
              <Progress value={uploadProgress} size="lg" colorScheme="purple" hasStripe isAnimated />
              <Text mt={2} textAlign="center">{uploadProgress}% Uploaded</Text>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} isDisabled={uploading}>Cancel</Button>
          <Button colorScheme="purple" ml={3} onClick={handleUpload} isLoading={uploading} isDisabled={!selectedFile}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkUploadModal;