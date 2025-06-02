import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
  Stack,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
} from '@chakra-ui/react';
import { Controller, useFormContext, ControllerRenderProps } from 'react-hook-form';

type FieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';

interface BaseFieldProps {
  name: string;
  label: string;
  type?: FieldType;
  helperText?: string;
  isRequired?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input';
  inputType?: string;
  inputProps?: InputProps;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  textareaProps?: TextareaProps;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  options: { value: string; label: string }[];
  selectProps?: SelectProps;
}

interface CheckboxFieldProps extends BaseFieldProps {
  type: 'checkbox';
  checkboxProps?: CheckboxProps;
}

interface RadioFieldProps extends BaseFieldProps {
  type: 'radio';
  options: { value: string | number; label: string }[];
  radioProps?: RadioProps;
}

type FormFieldProps =
  | InputFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
  | RadioFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { name, label, type = 'input', helperText, isRequired = false } = props;
  const { control, formState } = useFormContext();
  const error = formState.errors[name];

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Use the field directly from react-hook-form
          const radioField = field;
          switch (type) {
            case 'textarea':
              const { textareaProps } = props as TextareaFieldProps;
              return <Textarea id={name} {...field} {...textareaProps} />;

            case 'select':
              const { options, selectProps } = props as SelectFieldProps;
              return (
                <Select id={name} {...field} {...selectProps}>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              );

            case 'checkbox':
              const { checkboxProps } = props as CheckboxFieldProps;
              return (
                <Checkbox
                  id={name}
                  isChecked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  {...checkboxProps}
                >
                  {label}
                </Checkbox>
              );

            case 'radio':
              const { options: radioOptions, radioProps } = props as RadioFieldProps;
              return (
                <RadioGroup value={String(radioField.value || '')} onChange={radioField.onChange} {...radioProps}>
                  <Stack direction="row">
                    {radioOptions.map((option) => (
                      <Radio key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              );

            case 'input':
            default:
              const { inputType = 'text', inputProps } = props as InputFieldProps;
              return <Input id={name} type={inputType} {...field} {...inputProps} />;
          }
        }}
      />

      {error ? (
        <FormErrorMessage>{error.message?.toString()}</FormErrorMessage>
      ) : helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default FormField;