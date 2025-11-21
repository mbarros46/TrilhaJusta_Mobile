import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ControlledInputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: FieldError;
  rules?: object;
}

export function ControlledInput({
  name,
  control,
  label,
  error,
  rules,
  ...textInputProps
}: ControlledInputProps) {
  return (
    <ThemedView style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#999"
            {...textInputProps}
          />
        )}
      />
      {error && (
        <ThemedText style={styles.errorText}>{error.message}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#FF6B35',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
});
