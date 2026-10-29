import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormValues, Submission } from '../types/form';

const STORAGE_KEY = '@cp3-mobile/submissions';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFormValues = (value: unknown): value is FormValues =>
  isRecord(value) && Object.values(value).every((v) => typeof v === 'string' || typeof v === 'boolean');

const isSubmission = (value: unknown): value is Submission =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.submittedAt === 'string' &&
  isFormValues(value.values);

/** Lê os envios salvos. Dados corrompidos ou em formato inesperado são ignorados. */
export async function loadSubmissions(): Promise<Submission[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSubmission) : [];
  } catch {
    return [];
  }
}

export async function saveSubmissions(submissions: Submission[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export async function clearSubmissions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
