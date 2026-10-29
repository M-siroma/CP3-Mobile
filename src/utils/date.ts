const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (n: number): string => String(n).padStart(2, '0');

/** Converte um Date em `AAAA-MM-DD` usando o fuso local (evita "voltar um dia" por UTC). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Converte `AAAA-MM-DD` em Date local; retorna null se a data for inválida. */
export function parseIsoDate(value: string): Date | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const isSameDate =
    date.getFullYear() === Number(y) && date.getMonth() === Number(m) - 1 && date.getDate() === Number(d);
  return isSameDate ? date : null;
}

/** `AAAA-MM-DD` → `DD/MM/AAAA`. */
export function formatIsoDate(value: string): string {
  const date = parseIsoDate(value);
  return date ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}` : value;
}

export function isFutureDate(value: string): boolean {
  const date = parseIsoDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime();
}
