import { FieldConfig, FieldValue, FormErrors, FormValues } from '../types/form';
import { isFutureDate, parseIsoDate } from './date';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NUMBER_REGEX = /^-?\d+([.,]\d+)?$/;

const asText = (value: FieldValue): string => (typeof value === 'string' ? value.trim() : '');

/**
 * Valida um campo de acordo com o seu tipo. Retorna a mensagem de erro ou `undefined`.
 *
 * Regras por tipo:
 * - text / multiline / password: obrigatório → não pode ser vazio (espaços não contam);
 *   `minLength` é verificado sempre que houver valor.
 * - email / number: obrigatório → não vazio; se preenchido, precisa ter formato válido.
 * - select / radio: obrigatório → precisa ter uma opção escolhida que exista em `options`.
 * - checkbox: obrigatório → precisa estar marcado (ex.: aceite de termos).
 * - switch: sempre possui resposta (ligado = true, desligado = false), por isso
 *   `false` NÃO é tratado como ausência de resposta.
 * - date: obrigatório → precisa ter data válida; datas futuras são rejeitadas.
 */
export function validateField(field: FieldConfig, value: FieldValue): string | undefined {
  switch (field.type) {
    case 'text':
    case 'multiline':
    case 'password': {
      const text = asText(value);
      if (!text) return field.required ? `Preencha o campo "${field.label}".` : undefined;
      if (field.minLength && text.length < field.minLength) {
        return `${field.label} deve ter pelo menos ${field.minLength} caracteres.`;
      }
      return undefined;
    }
    case 'email': {
      const text = asText(value);
      if (!text) return field.required ? `Preencha o campo "${field.label}".` : undefined;
      return EMAIL_REGEX.test(text) ? undefined : 'Informe um e-mail válido.';
    }
    case 'number': {
      const text = asText(value);
      if (!text) return field.required ? `Preencha o campo "${field.label}".` : undefined;
      return NUMBER_REGEX.test(text) ? undefined : `${field.label} deve ser um número.`;
    }
    case 'select':
    case 'radio': {
      const text = asText(value);
      if (!text) return field.required ? `Selecione uma opção em "${field.label}".` : undefined;
      return field.options.some((o) => o.value === text) ? undefined : 'Opção inválida.';
    }
    case 'checkbox':
      return field.required && value !== true ? `Marque "${field.label}" para continuar.` : undefined;
    case 'switch':
      return typeof value === 'boolean' ? undefined : `Preencha o campo "${field.label}".`;
    case 'date': {
      const text = asText(value);
      if (!text) return field.required ? `Preencha o campo "${field.label}".` : undefined;
      if (!parseIsoDate(text)) return 'Informe uma data válida.';
      return isFutureDate(text) ? 'A data não pode estar no futuro.' : undefined;
    }
  }
}

export function validateForm(fields: FieldConfig[], values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of fields) {
    const message = validateField(field, values[field.id]);
    if (message) errors[field.id] = message;
  }
  return errors;
}
