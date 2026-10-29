import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useDynamicForm } from '../hooks/useDynamicForm';
import { colors } from '../theme/colors';
import { FormConfig, FormValues } from '../types/form';
import { Button } from './Button';
import { FieldRenderer } from './fields/FieldRenderer';

interface DynamicFormProps {
  config: FormConfig;
  /** Chamado apenas com o formulário válido; retorna true se o envio foi concluído. */
  onValidSubmit: (values: FormValues) => Promise<boolean>;
}

/** Monta o formulário percorrendo `config.fields` — nenhum campo é escrito à mão aqui. */
export function DynamicForm({ config, onValidSubmit }: DynamicFormProps) {
  const { values, errors, errorCount, submitAttempted, setFieldValue, submit, reset } = useDynamicForm(
    config.fields,
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const validValues = submit();
    if (!validValues) return;
    setSubmitting(true);
    const done = await onValidSubmit(validValues);
    setSubmitting(false);
    if (done) reset();
  }, [submit, onValidSubmit, reset]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{config.title}</Text>
      {config.description && <Text style={styles.description}>{config.description}</Text>}
      <Text style={styles.legend}>
        Campos marcados com <Text style={styles.required}>*</Text> são obrigatórios.
      </Text>

      {config.fields.map((field) => (
        <FieldRenderer
          key={field.id}
          field={field}
          value={values[field.id]}
          error={errors[field.id]}
          onChange={setFieldValue}
        />
      ))}

      {submitAttempted && errorCount > 0 && (
        <View style={styles.banner} accessibilityRole="alert">
          <Text style={styles.bannerText}>
            {errorCount === 1
              ? 'Há 1 campo pendente ou inválido. Corrija-o para enviar.'
              : `Há ${errorCount} campos pendentes ou inválidos. Corrija-os para enviar.`}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button label="Limpar formulário" variant="secondary" onPress={reset} disabled={submitting} />
        <Button
          label={submitting ? 'Salvando...' : (config.submitLabel ?? 'Enviar')}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  legend: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    color: colors.textMuted,
  },
  required: {
    color: colors.error,
  },
  banner: {
    backgroundColor: colors.errorSoft,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  bannerText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
