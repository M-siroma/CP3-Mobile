import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors } from '../../theme/colors';
import { FieldComponentProps, TextFieldConfig, TextFieldType } from '../../types/form';
import { FieldWrapper, fieldStyles } from './FieldWrapper';

/** Propriedades nativas do TextInput aplicadas conforme o `type` do campo. */
const INPUT_PROPS_BY_TYPE: Record<TextFieldType, TextInputProps> = {
  text: { autoCapitalize: 'words' },
  email: { keyboardType: 'email-address', autoCapitalize: 'none', autoComplete: 'email', autoCorrect: false },
  password: { secureTextEntry: true, autoCapitalize: 'none', autoComplete: 'password', autoCorrect: false },
  number: { keyboardType: 'numeric', inputMode: 'decimal' },
  multiline: { multiline: true, numberOfLines: 4, textAlignVertical: 'top' },
};

/** Mantém apenas dígitos, separador decimal e sinal em campos numéricos. */
const sanitizeNumber = (text: string): string => text.replace(/[^\d.,-]/g, '');

type Props = FieldComponentProps<TextFieldConfig, string>;

/** Campo de texto genérico usado por text, email, password, number e multiline. */
export function TextInputField({ field, value, error, onChange }: Props) {
  const handleChange = (text: string) =>
    onChange(field.id, field.type === 'number' ? sanitizeNumber(text) : text);

  return (
    <FieldWrapper label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <TextInput
        {...INPUT_PROPS_BY_TYPE[field.type]}
        value={value}
        onChangeText={handleChange}
        placeholder={field.placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={field.label}
        style={[fieldStyles.input, field.type === 'multiline' && styles.multiline, error && fieldStyles.inputError]}
      />
    </FieldWrapper>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 110,
  },
});
