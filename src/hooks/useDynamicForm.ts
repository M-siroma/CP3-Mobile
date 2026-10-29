import { useCallback, useMemo, useState } from 'react';

import { FieldConfig, FieldValue, FormErrors, FormValues } from '../types/form';
import { validateForm } from '../utils/validation';
import { buildInitialValues } from '../utils/values';

interface UseDynamicFormResult {
  values: FormValues;
  /** Erros visíveis ao usuário (só aparecem após a primeira tentativa de envio). */
  errors: FormErrors;
  errorCount: number;
  submitAttempted: boolean;
  setFieldValue: (id: string, value: FieldValue) => void;
  /** Valida tudo; retorna os valores se o formulário estiver válido, ou `null`. */
  submit: () => FormValues | null;
  reset: () => void;
}

/** Controla estado e validação de um formulário cujos campos vêm da configuração. */
export function useDynamicForm(fields: FieldConfig[]): UseDynamicFormResult {
  const initialValues = useMemo(() => buildInitialValues(fields), [fields]);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Recalcula a validação apenas quando os valores (ou os campos) mudam.
  const allErrors = useMemo(() => validateForm(fields, values), [fields, values]);
  const errorCount = Object.keys(allErrors).length;

  const setFieldValue = useCallback((id: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const submit = useCallback((): FormValues | null => {
    setSubmitAttempted(true);
    return errorCount === 0 ? values : null;
  }, [errorCount, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setSubmitAttempted(false);
  }, [initialValues]);

  return {
    values,
    errors: submitAttempted ? allErrors : {},
    errorCount,
    submitAttempted,
    setFieldValue,
    submit,
    reset,
  };
}
