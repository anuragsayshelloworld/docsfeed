import type { Timestamp } from 'firebase/firestore';

function isTimestamp(value: unknown): value is Timestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  );
}

export function toMillis(value: unknown): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }
  if (isTimestamp(value)) return value.toDate().getTime();
  return 0;
}

export function formatSavedDate(value: unknown): string {
  const milliseconds = toMillis(value);
  if (!milliseconds) return 'N/A';
  return new Date(milliseconds).toLocaleString();
}
