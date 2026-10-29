/** Tipos de campo suportados pelo formulário dinâmico. */
export type TextFieldType = 'text' | 'email' | 'password' | 'number' | 'multiline';
export type ChoiceFieldType = 'select' | 'radio';
export type FieldType = TextFieldType | ChoiceFieldType | 'checkbox' | 'switch' | 'date';

/** Alternativa exibida em campos `select` e `radio`. */
export interface FieldOption {
  label: string;
  value: string;
}

interface BaseField {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
}

export interface TextFieldConfig extends BaseField {
  type: TextFieldType;
  placeholder?: string;
  minLength?: number;
}

export interface ChoiceFieldConfig extends BaseField {
  type: ChoiceFieldType;
  options: FieldOption[];
  placeholder?: string;
}

export interface CheckboxFieldConfig extends BaseField {
  type: 'checkbox';
}

export interface SwitchFieldConfig extends BaseField {
  type: 'switch';
  defaultValue?: boolean;
}

export interface DateFieldConfig extends BaseField {
  type: 'date';
  placeholder?: string;
}

/** União discriminada por `type`: cada tipo carrega apenas as propriedades que usa. */
export type FieldConfig =
  | TextFieldConfig
  | ChoiceFieldConfig
  | CheckboxFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig;

export interface FormConfig {
  title: string;
  description?: string;
  submitLabel?: string;
  fields: FieldConfig[];
}

/**
 * Valor de um campo:
 * - texto, e-mail, senha, número, multiline, select, radio e date → string
 *   (date no formato ISO `AAAA-MM-DD`; string vazia = não preenchido)
 * - checkbox e switch → boolean
 */
export type FieldValue = string | boolean;

export type FormValues = Record<string, FieldValue>;

export type FormErrors = Partial<Record<string, string>>;

/** Registro de um envio válido, persistido no AsyncStorage. */
export interface Submission {
  id: string;
  submittedAt: string;
  values: FormValues;
}

/** Props comuns a todos os componentes de campo. */
export interface FieldComponentProps<TConfig extends FieldConfig, TValue extends FieldValue> {
  field: TConfig;
  value: TValue;
  error?: string;
  onChange: (id: string, value: TValue) => void;
}
