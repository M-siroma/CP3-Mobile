import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { FieldConfig, Submission } from '../types/form';
import { formatFieldValue } from '../utils/values';

interface SubmissionCardProps {
  fields: FieldConfig[];
  submission: Submission;
  highlighted?: boolean;
}

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString('pt-BR');
};

/** Mostra um envio como pares "rótulo do campo → valor", na ordem da configuração. */
export function SubmissionCard({ fields, submission, highlighted = false }: SubmissionCardProps) {
  const rows = useMemo(
    () =>
      fields.map((field) => ({
        id: field.id,
        label: field.label,
        value: formatFieldValue(field, submission.values[field.id]),
      })),
    [fields, submission.values],
  );

  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      <Text style={styles.timestamp}>Enviado em {formatTimestamp(submission.submittedAt)}</Text>
      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 2,
  },
  highlighted: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    flexBasis: 160,
    flexGrow: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  value: {
    flexBasis: 160,
    flexGrow: 2,
    fontSize: 15,
    color: colors.text,
  },
});
