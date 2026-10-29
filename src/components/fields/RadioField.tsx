import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { ChoiceFieldConfig, FieldComponentProps } from '../../types/form';
import { FieldWrapper } from './FieldWrapper';

type Props = FieldComponentProps<ChoiceFieldConfig, string>;

/** Grupo de opções exclusivas; as alternativas vêm de `field.options`. */
export function RadioField({ field, value, error, onChange }: Props) {
  return (
    <FieldWrapper label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <View style={styles.group} accessibilityRole="radiogroup">
        {field.options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(field.id, option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                error && styles.optionError,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.circle, selected && styles.circleSelected]}>
                {selected && <View style={styles.dot} />}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionError: {
    borderColor: colors.error,
  },
  pressed: {
    opacity: 0.7,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    borderColor: colors.primary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.text,
  },
});
