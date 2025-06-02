import { useState } from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@chakra-ui/react';
import { useApi } from './useApi';

interface UseFormWithValidationProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  apiEndpoint?: string;
  successMessage?: string;
  errorMessage?: string;
}

interface UseFormWithValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean;
  submitError: string | null;
  submitForm: (data: T) => Promise<void>;
}

export function useFormWithValidation<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  apiEndpoint,
  successMessage = 'Success!',
  errorMessage = 'An error occurred. Please try again.',
}: UseFormWithValidationProps<T>): UseFormWithValidationReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();
  const [, { request }] = useApi();

  const formMethods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const submitForm = async (data: T) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (apiEndpoint) {
        const response = await request(apiEndpoint, {
          method: 'POST',
          body: data,
          requiresAuth: true,
        });

        if (response) {
          toast({
            title: successMessage,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });

          await onSubmit(data);
        }
      } else {
        await onSubmit(data);
        
        toast({
          title: successMessage,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      setSubmitError(errorMsg);
      
      toast({
        title: 'Error',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...formMethods,
    isSubmitting,
    submitError,
    submitForm,
  };
}