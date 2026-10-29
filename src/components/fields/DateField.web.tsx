import { CSSProperties } from 'react';

import { colors } from '../../theme/colors';
import { DateFieldConfig, FieldComponentProps } from '../../types/form';
import { toIsoDate } from '../../utils/date';
import { FieldWrapper } from './FieldWrapper';

type Props = FieldComponentProps<DateFieldConfig, string>;

/**
 * Versão Web do campo de data. O datetimepicker nativo não possui suporte à Web,
 * então usamos o `<input type="date">` do navegador, que já trabalha com `AAAA-MM-DD`.
 */
export function DateField({ field, value, error, onChange }: Props) {
  const inputStyle: CSSProperties = {
    ...baseInputStyle,
    borderColor: error ? colors.error : colors.border,
    backgroundColor: error ? colors.errorSoft : colors.surface,
    color: value ? colors.text : colors.textMuted,
  };

  return (
    <FieldWrapper label={field.label} required={field.required} helperText={field.helperText} error={error}>
      <input
        type="date"
        value={value}
        max={toIsoDate(new Date())}
        aria-label={field.label}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(field.id, event.target.value)}
        style={inputStyle}
      />
    </FieldWrapper>
  );
}

const baseInputStyle: CSSProperties = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 10,
  paddingLeft: 14,
  paddingRight: 14,
  paddingTop: 12,
  paddingBottom: 12,
  fontSize: 16,
  fontFamily: 'inherit',
  outlineColor: colors.primary,
};
