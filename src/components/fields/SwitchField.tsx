import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { FieldComponentProps, SwitchFieldConfig } from '../../types/form';
import { FieldWrapper } from './FieldWrapper';

type Props = FieldComponentProps<SwitchFieldConfig, boolean>;

/** Controle ligado/desligado. `false` é uma resposta válida (desligado). */
export function SwitchField({ field, value, error, onChange }: Props) {
  return (
    <FieldWrapper label={field.label} helperText={field.helperText} error={error} showLabel={false}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <Text style={styles.state}>{value ? 'Ligado' : 'Desligado'}</Text>
        <Switch
          value={value}
          onValueChange={(next) => onChange(field.id, next)}
          accessibilityLabel={field.label}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  state: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
