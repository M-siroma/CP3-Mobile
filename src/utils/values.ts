import { FieldConfig, FieldValue, FormValues } from '../types/form';
import { formatIsoDate } from './date';

/** Valor inicial de cada campo, derivado apenas do seu tipo na configuração. */
export function getInitialValue(field: FieldConfig): FieldValue {
  switch (field.type) {
    case 'checkbox':
      return false;
    case 'switch':
      return field.defaultValue ?? false;
    default:
      return '';
  }
}

export function buildInitialValues(fields: FieldConfig[]): FormValues {
  return Object.fromEntries(fields.map((field) => [field.id, getInitialValue(field)]));
}

export const PASSWORD_MASK = '••••••••';

/**
 * Prepara os valores para persistência: normaliza textos e não armazena a senha
 * em texto puro (fica apenas a indicação de que foi informada).
 */
export function sanitizeForStorage(fields: FieldConfig[], values: FormValues): FormValues {
  const result: FormValues = {};
  for (const field of fields) {
    const value = values[field.id];
    if (field.type === 'password') {
      result[field.id] = typeof value === 'string' && value.length > 0 ? PASSWORD_MASK : '';
    } else {
      result[field.id] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return result;
}

/** Texto legível do valor de um campo, usado na exibição do resultado. */
export function formatFieldValue(field: FieldConfig, value: FieldValue | undefined): string {
  if (value === undefined || value === '') return '—';

  switch (field.type) {
    case 'select':
    case 'radio':
      return field.options.find((o) => o.value === value)?.label ?? String(value);
    case 'checkbox':
      return value === true ? 'Marcado' : 'Não marcado';
    case 'switch':
      return value === true ? 'Ligado' : 'Desligado';
    case 'date':
      return typeof value === 'string' ? formatIsoDate(value) : '—';
    default:
      return String(value);
  }
}
