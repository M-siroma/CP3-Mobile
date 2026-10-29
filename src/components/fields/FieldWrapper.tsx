import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  /** Quando false, o rótulo é desenhado pelo próprio campo (checkbox/switch). */
  showLabel?: boolean;
  children: ReactNode;
}

/** Moldura padrão de todo campo: rótulo, indicador de obrigatório, ajuda e erro. */
export function FieldWrapper({ label, required, helperText, error, showLabel = true, children }: FieldWrapperProps) {
  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {children}
      {helperText && !error && <Text style={styles.helper}>{helperText}</Text>}
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

export const fieldStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  placeholder: {
    color: colors.textMuted,
  },
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  helper: {
    fontSize: 13,
    color: colors.textMuted,
  },
  error: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
  },
});
