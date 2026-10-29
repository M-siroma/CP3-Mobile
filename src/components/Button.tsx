import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, variant !== 'primary' && labelColor[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.surface,
  },
});

const labelColor = StyleSheet.create({
  secondary: { color: colors.text },
  danger: { color: colors.error },
});
