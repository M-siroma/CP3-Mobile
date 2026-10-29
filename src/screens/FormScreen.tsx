import { useCallback, useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { DynamicForm } from '../components/DynamicForm';
import { SubmissionCard } from '../components/SubmissionCard';
import { formConfig } from '../config/formConfig';
import { useSubmissions } from '../hooks/useSubmissions';
import { colors } from '../theme/colors';
import { FormValues } from '../types/form';
import { sanitizeForStorage } from '../utils/values';

export function FormScreen() {
  const { submissions, status, message, addSubmission, clearAll } = useSubmissions();

  const [latest, ...history] = submissions;
  const busy = status === 'saving' || status === 'clearing';

  const fieldSummary = useMemo(() => {
    const required = formConfig.fields.filter((field) => field.required).length;
    const types = new Set(formConfig.fields.map((field) => field.type)).size;
    return `${formConfig.fields.length} campos · ${types} tipos · ${required} obrigatórios`;
  }, []);

  const handleValidSubmit = useCallback(
    async (values: FormValues) => {
      const saved = await addSubmission(sanitizeForStorage(formConfig.fields, values));
      return saved !== null;
    },
    [addSubmission],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.summary}>{fieldSummary}</Text>

            <DynamicForm config={formConfig} onValidSubmit={handleValidSubmit} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dados salvos</Text>
              <Button
                label={status === 'clearing' ? 'Apagando...' : 'Limpar dados salvos'}
                variant="danger"
                onPress={clearAll}
                disabled={busy || submissions.length === 0}
              />
            </View>

            {message && (
              <View style={[styles.notice, status === 'error' && styles.noticeError]}>
                <Text style={[styles.noticeText, status === 'error' && styles.noticeTextError]}>{message}</Text>
              </View>
            )}

            {status === 'loading' ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : latest ? (
              <>
                <Text style={styles.subTitle}>Resultado do último envio</Text>
                <SubmissionCard fields={formConfig.fields} submission={latest} highlighted />
                {history.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>Envios anteriores ({history.length})</Text>
                    {history.map((submission) => (
                      <SubmissionCard key={submission.id} fields={formConfig.fields} submission={submission} />
                    ))}
                  </>
                )}
              </>
            ) : (
              <Text style={styles.empty}>Nenhum envio salvo. Preencha o formulário e envie.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    paddingBottom: 48,
  },
  container: {
    width: '100%',
    maxWidth: 720,
    gap: 12,
  },
  summary: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  notice: {
    backgroundColor: colors.successSoft,
    borderRadius: 10,
    padding: 12,
  },
  noticeError: {
    backgroundColor: colors.errorSoft,
  },
  noticeText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  noticeTextError: {
    color: colors.error,
  },
  loader: {
    marginVertical: 24,
  },
  empty: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
