import { useCallback, useEffect, useState } from 'react';

import { clearSubmissions, loadSubmissions, saveSubmissions } from '../services/submissionStorage';
import { FormValues, Submission } from '../types/form';

export type StorageStatus = 'loading' | 'idle' | 'saving' | 'clearing' | 'error';

interface UseSubmissionsResult {
  submissions: Submission[];
  status: StorageStatus;
  message: string | null;
  addSubmission: (values: FormValues) => Promise<Submission | null>;
  clearAll: () => Promise<void>;
}

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Mantém a lista de envios sincronizada com o AsyncStorage. */
export function useSubmissions(): UseSubmissionsResult {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<StorageStatus>('loading');
  const [message, setMessage] = useState<string | null>(null);

  // Recupera os dados persistidos sempre que o app é aberto.
  useEffect(() => {
    let active = true;
    loadSubmissions()
      .then((stored) => {
        if (!active) return;
        setSubmissions(stored);
        setStatus('idle');
        setMessage(stored.length > 0 ? `${stored.length} envio(s) recuperado(s) do armazenamento local.` : null);
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
        setMessage('Não foi possível ler os dados salvos.');
      });
    return () => {
      active = false;
    };
  }, []);

  const addSubmission = useCallback(
    async (values: FormValues): Promise<Submission | null> => {
      const submission: Submission = { id: createId(), submittedAt: new Date().toISOString(), values };
      const next = [submission, ...submissions];
      setStatus('saving');
      try {
        await saveSubmissions(next);
        setSubmissions(next);
        setStatus('idle');
        setMessage('Envio salvo no armazenamento local.');
        return submission;
      } catch {
        setStatus('error');
        setMessage('Não foi possível salvar o envio.');
        return null;
      }
    },
    [submissions],
  );

  const clearAll = useCallback(async () => {
    setStatus('clearing');
    try {
      await clearSubmissions();
      setSubmissions([]);
      setStatus('idle');
      setMessage('Dados salvos foram apagados.');
    } catch {
      setStatus('error');
      setMessage('Não foi possível apagar os dados salvos.');
    }
  }, []);

  return { submissions, status, message, addSubmission, clearAll };
}
