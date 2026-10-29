import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { CheckboxFieldConfig, FieldComponentProps } from '../../types/form';
import { FieldWrapper } from './FieldWrapper';

type Props = FieldComponentProps<CheckboxFieldConfig, boolean>;

/** Caixa de marcação construída com Pressable (funciona igual nas três plataformas). */
export function CheckboxField({ field, value, error, onChange }: Props) {
  return (
    <FieldWrapper label={field.label} helperText={field.helperText} error={error} showLabel={false}>
      <Pressable
        onPress={() => onChange(field.id, !value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: value }}
        accessibilityLabel={field.label}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={[styles.box, value && styles.boxChecked, error && styles.boxError]}>
          {value && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
      </Pressable>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  boxError: {
    borderColor: colors.error,
  },
  tick: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
});
