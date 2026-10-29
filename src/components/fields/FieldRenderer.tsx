import { memo } from 'react';

import { FieldConfig, FieldValue } from '../../types/form';
import { CheckboxField } from './CheckboxField';
import { DateField } from './DateField';
import { RadioField } from './RadioField';
import { SelectField } from './SelectField';
import { SwitchField } from './SwitchField';
import { TextInputField } from './TextInputField';

interface FieldRendererProps {
  field: FieldConfig;
  value: FieldValue | undefined;
  error?: string;
  onChange: (id: string, value: FieldValue) => void;
}

const asString = (value: FieldValue | undefined): string => (typeof value === 'string' ? value : '');
const asBoolean = (value: FieldValue | undefined): boolean => value === true;

/**
 * Escolhe o componente de entrada a partir de `field.type`.
 * É o único ponto que conhece os tipos: a tela apenas percorre `fields` e chama este componente.
 */
function FieldRendererBase({ field, value, error, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'multiline':
      return <TextInputField field={field} value={asString(value)} error={error} onChange={onChange} />;
    case 'select':
      return <SelectField field={field} value={asString(value)} error={error} onChange={onChange} />;
    case 'radio':
      return <RadioField field={field} value={asString(value)} error={error} onChange={onChange} />;
    case 'checkbox':
      return <CheckboxField field={field} value={asBoolean(value)} error={error} onChange={onChange} />;
    case 'switch':
      return <SwitchField field={field} value={asBoolean(value)} error={error} onChange={onChange} />;
    case 'date':
      return <DateField field={field} value={asString(value)} error={error} onChange={onChange} />;
  }
}

/** Memoizado: com `onChange` estável (useCallback), só o campo alterado é renderizado de novo. */
export const FieldRenderer = memo(FieldRendererBase);
